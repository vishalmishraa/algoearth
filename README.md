# Deploy Judge0 on Kubernetes (Recommended: DigitalOcean's K8s)

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
