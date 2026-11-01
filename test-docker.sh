#!/usr/bin/env bash
# Vectorr Docker Build & Test Script
# Run this to verify the Docker build before deploying to Coolify

set -euo pipefail

echo "========================================="
echo "Vectorr Docker Build & Test"
echo "========================================="
echo ""

# Check prerequisites
echo "1. Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install from https://docker.com"
    exit 1
fi
echo "✅ Docker installed"

# Build the image
echo ""
echo "2. Building Docker image..."
docker build -t vectorr:test .
echo "✅ Build completed"

# Verify image size
echo ""
echo "3. Checking image size..."
IMAGE_SIZE=$(docker images vectorr:test --format "{{.Size}}")
echo "📦 Image size: $IMAGE_SIZE"

# Test health check
echo ""
echo "4. Starting container for testing..."
CONTAINER_ID=$(docker run -d -p 3001:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=test-key \
  -e SUPABASE_SERVICE_ROLE_KEY=test-secret \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3001 \
  vectorr:test)

echo "✅ Container started: $CONTAINER_ID"

# Wait for container to be ready
echo ""
echo "5. Waiting for container to be ready..."
sleep 5

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_ID"; then
    echo "❌ Container failed to start"
    echo "Logs:"
    docker logs "$CONTAINER_ID"
    docker rm -f "$CONTAINER_ID"
    exit 1
fi
echo "✅ Container is running"

# Test health endpoint
echo ""
echo "6. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health || echo "failed")
if [ "$HEALTH_RESPONSE" == "failed" ]; then
    echo "❌ Health check failed"
    echo "Logs:"
    docker logs "$CONTAINER_ID"
    docker rm -f "$CONTAINER_ID"
    exit 1
fi
echo "✅ Health check passed: $HEALTH_RESPONSE"

# Clean up
echo ""
echo "7. Cleaning up..."
docker stop "$CONTAINER_ID" > /dev/null
docker rm "$CONTAINER_ID" > /dev/null
echo "✅ Test container removed"

# Summary
echo ""
echo "========================================="
echo "✅ All tests passed!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Push code to GitHub"
echo "2. Import docker-compose.yml into Coolify"
echo "3. Set environment variables in Coolify"
echo "4. Deploy!"
echo ""
echo "See COOLIFY_DEPLOYMENT.md for detailed instructions."
