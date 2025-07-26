# How to run the app

```bash
docker compose -f docker-compose.dev.yml up --build
```

# Version 1 : Simple Architecture with Reverse Proxy and Gateway

This contains a simplified architecture of the application with an Reverse Proxy, API Gateway and 2 Services consuming them.

> Note : The Authorization and Authentication has not been implemented

![](.\docs\img\api-gw-v1.png)
