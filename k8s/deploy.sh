    #!/bin/bash

    set -e

    # Define color codes
    GREEN='\033[0;32m'
    BLUE='\033[0;96m'
    RED='\033[0;31m'
    YELLOW='\033[1;33m'
    NC='\033[0m' # No Color

    echo -e "${GREEN}Starting deployment process...${NC}"

    # Apply Longhorn helm chart
    echo -e "${BLUE}Applying Longhorn helm chart...${NC}"
    helm repo add longhorn https://charts.longhorn.io
    helm repo update
    helm upgrade --install longhorn longhorn/longhorn --namespace longhorn --create-namespace

    # Wait for Longhorn to be ready
    echo -e "${BLUE}Waiting for Longhorn to be ready...${NC}"
    for i in {60..1}; do
        echo -ne "${NC}Waiting for ${RED}$i ${GREEN}seconds...\r"
        sleep 1
    done
    echo -e "\n${GREEN}Wait completed. Proceeding with deployment...${NC}"

    # Apply secret
    echo -e "${BLUE}Applying secret...${NC}"
    kubectl apply -f secret.yml

    # Apply NGINX Ingress helm chart
    echo -e "${BLUE}Applying NGINX Ingress helm chart...${NC}"
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace

    # Wait for NGINX Ingress to be ready
    
    echo -e "${BLUE}Waiting for NGINX Ingress to be ready...${NC}"
    for i in {60..1}; do
        echo -ne "${BLUE}Waiting for ${RED}$i ${BLUE}seconds...\r"
        sleep 1
    done
    echo -e "\n${GREEN}Wait completed. Proceeding with deployment...${NC}"
    
    # Apply main manifest
    echo -e "${BLUE}Applying main manifest...${NC}"
    kubectl apply -f manifest.yml

    echo -e "${BLUE}Applied all manifest ."
    echo -e "${BLUE} Waiting for IP's..."


    # Function to wait for LoadBalancer IP
    wait_for_loadbalancer_ip() {
        local service_name=$1
        local namespace=$2
        local max_retries=30
        local retry_interval=10
        local external_ip=""
        local retries=0

        while [ -z "$external_ip" ] && [ $retries -lt $max_retries ]; do
            external_ip=$(kubectl get svc $service_name -n $namespace -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
            if [ -z "$external_ip" ]; then
                sleep $retry_interval
                ((retries++))
            fi
        done

        if [ -z "$external_ip" ]; then
            echo -e "${RED}Failed to get LoadBalancer IP for $service_name after $max_retries retries.${NC}"
            return 1
        fi

        echo "$external_ip"
    }

    # Wait for NGINX Ingress LoadBalancer IP
    nginx_external_ip=$(wait_for_loadbalancer_ip "ingress-nginx-controller" "ingress-nginx")
    if [ $? -eq 0 ]; then
        ingress_domain=$(kubectl get ingress -o jsonpath='{.items[0].spec.rules[0].host}')
        if [ -n "$ingress_domain" ]; then
            echo -e "${BLUE}To access your application, set up your domain DNS to point to: ${GREEN}$nginx_external_ip${NC}"
            echo -e "${BLUE}Once DNS is configured, you can access your application at: ${GREEN}https://$ingress_domain${NC}"
        else
            echo -e "${BLUE}To access your application, set up a domain to point to: ${GREEN}$nginx_external_ip${NC}"
            echo -e "${YELLOW}No domain found in Ingress resource. Please configure a domain and update your Ingress resource.${NC}"
        fi
    else
        echo -e "${RED}Failed to get NGINX Ingress LoadBalancer IP${NC}"
    fi

    # Get Postgres NodePort IP
    postgres_pod=$(kubectl get pods -l app=postgres -o jsonpath="{.items[0].metadata.name}")
    if [ -n "$postgres_pod" ]; then
        postgres_node=$(kubectl get pod $postgres_pod -o jsonpath="{.spec.nodeName}")
        postgres_node_ip=$(kubectl get nodes $postgres_node -o jsonpath="{.status.addresses[?(@.type=='ExternalIP')].address}")
        postgres_nodeport=$(kubectl get svc postgres-service -o jsonpath="{.spec.ports[0].nodePort}")

        if [ -n "$postgres_node_ip" ] && [ -n "$postgres_nodeport" ]; then
            DATABASE_URL="postgresql://postgres:supersecurepassword@$postgres_node_ip:$postgres_nodeport/algoearth?schema=public"
            echo -e "${BLUE}Postgres DB URL: ${GREEN}$postgres_url${NC}"

            # Run Prisma commands
            echo -e "${BLUE}Running Prisma commands...${NC}"
            cd ../../packages/db/
            export DATABASE_URL="$postgres_url"
            npx prisma generate
            npx prisma db push
            npx prisma db seed
            cd ../../k8s-private/v4/
            echo -e "${GREEN}Prisma commands completed successfully.${NC}"
        else
            echo -e "${RED}Failed to fetch Postgres NodePort details${NC}"
        fi
    else
        echo -e "${RED}Postgres pod not found${NC}"
    fi

    # Wait for Redis LoadBalancer IP
    redis_external_ip=$(wait_for_loadbalancer_ip "redis-service" "default")
    if [ $? -eq 0 ]; then
        echo -e "${BLUE}Redis URL : ${GREEN}  redis://:supersecurepassword@$redis_external_ip "
    else
        echo -e "${RED}Failed to get Redis LoadBalancer IP${NC}"
    fi

    echo -e "${GREEN}✨🎉 Deployment process completed! 🚀🌟${NC}"
