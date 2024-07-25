# Algoearth : Organize Competitive Programming Contests

This project is based on monolithic architecture with microservices approach and  involves deploying these Four services:  Web app , compiler , sweeper , problem-boilerplate-generator .  

## Architecture

![Architecture](./architecture.png)

The Architecture represents a CI/CD pipeline and deployment enviroment that utilize several tools and cloud services to manage build : 

1. Web App , compiler  , sweeper and boilerplate-generator : These services are the core components of the application . each serving diffrent purpose like web service is used to host the web app and manages the user interaction , compiler service is used to compile the code and return the output , sweeper service is used to keep the data realtime like updating the status of the submission and boilerplate-generator is used to generate the boilerplate code for the problem statement.

2. Turborepo/monorepo : The project is organized as a monorepo using the TurboRepo tool. This allows us to manage multiple services in a single repository and share code between them.

3. Node.js : Node.js is used as the runtime environment for these services, enabling Tyepscript execution on the server side.

4. GitHub: Source code is managed and versioned in GitHub. Developers commit and push their changes here.

5. Github Actions : Github Actions is used to automate the CI/CD pipeline. It builds the code, then push it to docker and deploys the services to the Kubernetes cluster.

6. Docker : Docker is used to containerize the services. Each service is built as a Docker image and pushed to the Docker Hub registry.

7. Kubernetes : Kubernetes is used to deploy the services. It manages the containers and ensures that the services are running and available.


## Deployment Configuration

The project aims to deploy and scale the services like web app , judge0 workers , sweeper and boilerplate-generator on Kubernetes cluster. The deployment is automated using Github actions .

### Key Objectives

1. *CI/CD Pipeline*: Automate build, docker push ,  and deployment with Github Actions.
2. *Kubernetes Deployment*: Use Kubernetes for scalable container orchestration.
3. *Monitoring*: Setup New-Relic for monitoring the services on entire Kubernetes cluster.

### Tools

- *Digital Ocean*: Infrastructure management.
- *Gihub Actions*: CI/CD automation.
- *Kubernetes (K8s)*: Container orchestration.
- *New Relic*: Metrics collection and visualization.

### Deployment Architecture

- *Web App*: Port 3000.
- *Compiler*: Port 2358.
- *Monitoring*: Using New Relic Monitoring service.
- *Database*: Postgres Database. Port 5432.
- *Cache*: Redis Cache. Port 6379.
- *Extras*: Judge0 workers with Autoscaling , Problem Testcases mounted to Judge0 workers and Web App simultaneously.

This setup ensures a robust, scalable, and efficient deployment of the algoearth services.

The deployment process is automated using Docker , Kubernetes and Github Actions. Below are the detailed steps and configurations required for each part of the process.

## Local Development Setup (Recommended: Dokcer)

This application need postgres and redis as database and cache respectively. You can use docker to run these services locally. This deployment is largely local machine based with pipelines running on the local machine through Docker .



### 1.  Clone the Repository into local system

Here are the steps -
Install git and clone the repository into the local system. As this is a node application, install node.js and npm 

### Install Dependencies

    command: npm install

This will install all the dependencies to run the backend.

### 2. Configure Environment Variables

- Copy .env.example to a .env file in `aaps/web` , `aaps/boilerplate-generator` and `packages/db`

    - app/web
        ```sh
        MOUNT_PATH=/apps/problems
        NEXTAUTH_SECRET=secret
        JWT_SECRET=secret
        DATABASE_URL=postgresql://postgres:supersecurepassword@localhost:5432/algoearth?schema=public
        REDIS_URL=redis://:supersecurepassword@localhost:6379
        JUDGE0_URI=https://localhost:2358
        ```
    - app/boilerplate-generator
        ```sh
        PROBLEMS_DIR_PATH=/apps/problems
        ```
    - packages/db
        ```sh
        DATABASE_URL=postgresql://postgres:supersecurepassword@localhost:5432/algoearth?schema=public
        MOUNT_PATH=../../apps/problems
        ```
We use port 3001 to communicate with the Mongo DB and collect data.

### 3. Configure Postgres and Redis

- Run the following commands to start the Postgres and Redis services:

    ```sh
    docker run --name postgres -e POSTGRES_PASSWORD=supersecurepassword -p 5432:5432 -d postgres
    
    ```

    ```sh
    docker run --name redis -e REDIS_PASSWORD=supersecurepassword -p 6379:6379 -d redis
    ```
### 4. System Configration to run Judge0 using Docker on Local machine
-   As judge0 require `cgroup ` v1 to run , but by default in system cgroup v2 is enabled. So we need to change it to cgroup v1.
    -  Run the following commands to change the cgroup version to v1:
        ```sh
        vim ~/Library/Group\ Containers/group.com.docker/settings.json
        # append "deprecatedCgroupv1": true
        ```

### 5. Setup Judge0 on Local Machine using docker compose 
 - Run the following commands to setup Judge0 on local machine:
    ```sh
        docker compose up
        #docker compose file is present in the root directory of the project it will also start the judge0 workers , postgres and redis
    ```
### 6. Run the services
 - Run the following commands to start the services:
    ```sh
        npm run dev
        #this will start the web app and boilerplate-generator
    ```

## Deploy Judge0 on Kubernetes (Recommended: DigitalOcean's K8s)

## Requirements
1. `kubectl`
2. `helm`
3. Kubeconfig setup

## Steps to mount Problems TestCases to  Judge0

### 1. Create a Kubernetes Cluster

Follow the instructions to create a Kubernetes cluster on DigitalOcean.

### 2. Change cgroup Version to v1

Judge0 requires cgroup v1 to run. By default, the cluster uses cgroup v2. Follow these steps to change it:

1. SSH into each node and run the following commands:

    ```sh
    sudo nano /etc/default/grub
    ```

    Add the following line at the top or edit it if it exists:

    ```sh
    GRUB_CMDLINE_LINUX="systemd.unified_cgroup_hierarchy=0"
    ```

    Then update GRUB and reboot:

    ```sh
    sudo update-grub
    sudo reboot
    ```

2. Check the cgroup version:

    ```sh
    stat -fc %T /sys/fs/cgroup/
    ```

    - For cgroup v2, the output is `cgroup2fs`.
    - For cgroup v1, the output is `tmpfs`.

3. Apply these changes on all nodes. (This can be efficiently done using Ansible.)

### 3. Deploy add-problems to Kubernetes

Judge0 server and workers require `add-problems`. Follow these steps to deploy it:

1. **Add NFS-based PVC for ReadWriteMany support:**

    Add the stable Helm repository:

    ```sh
    helm repo add stable https://charts.helm.sh/stable
    ```

    Update the Helm repository:

    ```sh
    helm repo update
    ```

    Install the NFS server provisioner:

    ```sh
    helm install nfs-server-provisioner stable/nfs-server-provisioner
    ```

2. **Apply the storage class:**

    ```sh
    kubectl apply -f ./ops/1-mount-problems/nfs-storageclass.yml
    ```

3. **Apply PersistentVolume (PV) and PersistentVolumeClaim (PVC) for `problems`:**

    ```sh
    kubectl apply -f ./ops/1-mount-problems/problems-pv-pvc.yml
    ```

4. **Deploy add-problems:**

    This will add all the problems to the shared PVC:

    ```sh
    kubectl apply -f ./ops/1-mount-problems/add-problem-deployment.yml
    ```

By following these steps, you will have `problems-pvc` pvc class that can be used by judge0 to acess test cases on your Kubernetes cluster.
