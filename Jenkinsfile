pipeline {
  agent any

    environment {
        DOMAIN = "192.168.1.220"
        DOCKER_NAME= "asp-tmdt-payment"
        DOCKER_IMAGE = "$DOMAIN:32000/$DOCKER_NAME"
        DOCKER_TAG="${GIT_COMMIT.substring(0,7)}"
    }

  stages {
      stage('Checkout') {
          steps {
             checkout scm
          }
      }
      stage('Build image') {
          environment {
                DOCKER_TAG="${GIT_COMMIT.substring(0,7)}"
            }
          steps {
             echo "---------BUILD IMAGE-----------"
             sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
             echo "---------PUSH IMAGE TO REGISTRY-----------"
             sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
          }
      }
      stage('Deploy to kubernetes') {
          steps {
            script { 
            sshagent(['truestats-ssh-private-key']) {
                script {
                    sh "ssh -o StrictHostKeyChecking=no truestats@$DOMAIN helm upgrade --install --force --set image.tag=${DOCKER_TAG} ${DOCKER_NAME} /home/truestats/helm/tmdt/${DOCKER_NAME}/ "
                }
            }
            }
          }
      }
  }
  post {
        success {
            echo "SUCCESSFUL"
        }
        failure {
            echo "FAILED"
        }
    }
}