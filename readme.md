# 🚀 Simple CI/CD Pipeline for a Static Website on AWS EC2

This project demonstrates how to set up a **CI/CD pipeline** to **automate deployment** of a static website using **Docker** and **AWS EC2**. The pipeline ensures that every code update is automatically pulled, built into a Docker container, and deployed on the EC2 instance.

---

## 📌 **Table of Contents**
- [Introduction](#introduction)
- [Project Workflow](#project-workflow)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Auto-Deployment with GitHub Actions](#auto-deployment-with-github-actions)
- [Troubleshooting](#troubleshooting)
- [Conclusion](#conclusion)

---

## 📌 **Introduction**
This project provides a fully automated **CI/CD solution** to deploy a **static website** (HTML, CSS, JS) using **Docker** on an **AWS EC2 Ubuntu instance**. The process includes:
- Setting up **Docker** to containerize the application.
- Using **GitHub Actions** for continuous integration and deployment.
- Deploying the website automatically after each code push.

---

## 📌 **Project Workflow**
1. **Developer pushes code** → GitHub repository
2. **GitHub Actions workflow triggers** → SSHs into EC2 and runs the deployment script
3. **EC2 updates the repository** → Builds a new Docker image
4. **Docker container restarts** → The new version of the website is live

---

## 📌 **Technologies Used**
- **AWS EC2** (Ubuntu 20.04) - Hosting the website
- **Docker** - Containerizing the application
- **GitHub Actions** - Automating the deployment
- **Nginx** - Serving the static website inside the container
- **Bash Scripting** - Automating server setup and deployment

---

## 📌 **Prerequisites**
Before proceeding, ensure you have:
- An **AWS EC2 instance** running Ubuntu
- **GitHub repository** with your static website files (`index.html`)
- **GitHub Actions** configured (optional but recommended)
- **SSH access** to your EC2 instance

---

## 📌 **Step-by-Step Setup**

### **Step 1: Connect to Your EC2 Instance**
```sh
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### **Step 2: Install Docker on EC2**
```sh
sudo apt update -y
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
```

### **Step 3: Clone Your GitHub Repository**
```sh
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### **Step 4: Create a `Dockerfile`**
```dockerfile
# Use Nginx as the base image
FROM nginx:latest

# Copy website files to Nginx default directory
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
```

### **Step 5: Build & Run the Docker Container**
```sh
docker build -t my-static-site .
docker run -d -p 80:80 --name website-container my-static-site
```

Your website is now accessible at:  
**`http://your-ec2-public-ip`**

---

## 📌 **Auto-Deployment with GitHub Actions**
To enable automatic deployment on every push, create a **GitHub Actions workflow**:

1. In your GitHub repo, create `.github/workflows/deploy.yml`
2. Add the following workflow script:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Deploy to EC2
        env:
          SSH_PRIVATE_KEY: ${{ secrets.EC2_SSH_KEY }}
          EC2_HOST: "your-ec2-ip"
          EC2_USER: "ubuntu"

        run: |
          echo "$SSH_PRIVATE_KEY" > private_key && chmod 600 private_key
          ssh -o StrictHostKeyChecking=no -i private_key $EC2_USER@$EC2_HOST << 'EOF'
            cd your-repository
            git pull origin main
            docker stop website-container || true
            docker rm website-container || true
            docker build -t my-static-site .
            docker run -d -p 80:80 --name website-container my-static-site
          EOF
```

3. **Set Up GitHub Secrets**:
   - Go to **GitHub Repo → Settings → Secrets and Variables → Actions**
   - Add **`EC2_SSH_KEY`** (Your private key contents)

4. **Commit & Push Changes**  
   ```sh
   git add .
   git commit -m "Added CI/CD workflow"
   git push origin main
   ```

Now, whenever you push new code to the `main` branch, **GitHub Actions will automatically deploy it to EC2**.

---

## 📌 **Troubleshooting**
| Problem | Solution |
|---------|----------|
| **Docker command not found** | Run `sudo apt install docker.io -y` |
| **Port 80 already in use** | Run `sudo lsof -i :80` to check and stop conflicting services |
| **GitHub Actions deployment failed** | Check logs in **GitHub Actions → Workflows** |
| **Website not accessible** | Ensure security group allows HTTP (port 80) |

---

## 📌 **Conclusion**
This project automates **CI/CD deployment** of a static website using:
✅ **Docker** for containerization  
✅ **AWS EC2** for hosting  
✅ **GitHub Actions** for automation  

🚀 **Now your website is fully automated and updates on every push!** 🎉  
Let me know if you need any improvements! 😊


