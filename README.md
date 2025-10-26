# Microservice Project

This repository contains the backend services for a shipping and logistics application, built using a microservices architecture.

## Overview

This project is a backend system composed of multiple independent services that work together. It appears to manage identity, master data, user notifications, and API routing. The architecture is containerized and designed for scalability, with services communicating asynchronously via message brokers and synchronously via gRPC.

## Architecture

The system is built as a set of **TypeScript** microservices running on Node.js.

* **Containerization:** All services are containerized using **Docker** and can be orchestrated locally with the `docker-compose.yml` file.
* **Service Communication:**
    * **gRPC:** Services likely communicate synchronously using gRPC, as defined by the `.proto` files in the `protobuf` directory.
    * **Asynchronous:** **Kafka** is used for asynchronous messaging and event streaming, as indicated by the `deployments/kafka` configuration.
* **CI/CD:** The project includes GitHub Actions workflows (in `.github/workflows`) for continuous integration and deployment.

## Services

The repository is structured into the following key services:

* **`gateway`**: The API Gateway, which acts as the single entry point for all client requests, routing them to the appropriate downstream service.
* **`iam`**: Identity and Access Management service, responsible for user authentication, authorization, and managing user data.
* **`mdm`**: Master Data Management service, likely responsible for handling core business entities and data (e.g., products, users, shipment details).
* **`notification`**: A service dedicated to handling and sending notifications (e.g., email, SMS, push notifications) to users.
* **`service-common`**: A shared library containing common code, utilities, types, and configurations used by multiple services.
* **`protobuf`**: Contains the Protocol Buffers definitions (`.proto` files) that define the gRPC service contracts for inter-service communication.
* **`service-template`**: A boilerplate template for quickly scaffolding new microservices within the project.

## Key Technologies

* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Runtime:** [Node.js](https://nodejs.org/en)
* **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
* **API:** [gRPC](https://grpc.io/) (for inter-service communication)
* **Messaging:** [Apache Kafka](https://kafka.apache.org/) (for event-driven architecture)
* **CI/CD:** [GitHub Actions](https://github.com/features/actions)

## Getting Started

*(You can update this section with specific commands)*

### Prerequisites

* [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/en/download/) (for local development)
* `npm` or `yarn`

### Running Locally

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/dangphu2412/shipping.git
    cd shipping
    ```

2.  **Install dependencies (if running services individually):**
    *(You may need to add instructions here, e.g., `npm install` in each service directory)*

3.  **Run the entire stack using Docker Compose:**
    This command will build the images for all services and start them, along with the Kafka cluster.

    ```sh
    docker-compose up -d --build
    ```

4.  **To stop the services:**

    ```sh
    docker-compose down
    ```