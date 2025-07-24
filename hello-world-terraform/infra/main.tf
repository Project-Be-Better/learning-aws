# Configure the AWS Provider
# This tells Terraform to use AWS as the cloud provider
provider "aws" {
  region = var.aws_region # Singapore region - where resources will be created
}

# Create an EC2 instance (virtual machine)
# This is the main compute resource that will run your applications
resource "aws_instance" "hello_ec2" {
  ami           = "ami-0df7a207adb9748c7" # Amazon Machine Image - Ubuntu 22.04 LTS in Singapore region
  instance_type = "t2.micro"              # Instance size - t2.micro is eligible for AWS free tier
  key_name      = var.key_name            # SSH key pair name for secure access (defined in variables.tf)

  # Attach the security group to control network access
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  # Add tags for better resource management and identification
  tags = {
    Name = "Hello-World-EC2"  # This name will appear in the AWS console
  }
}

# Create a security group (virtual firewall)
# This controls what network traffic is allowed to reach the EC2 instance
resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH from anywhere"

  # Ingress rules control incoming traffic TO the instance
  ingress {
    from_port   = 22              # SSH port
    to_port     = 22              # SSH port (same as from_port for single port)
    protocol    = "tcp"           # TCP protocol used by SSH
    cidr_blocks = ["0.0.0.0/0"]   # Allow from any IP address (0.0.0.0/0 means "anywhere")
                                  # Note: In production, you should restrict this to specific IP ranges
  }

  # Egress rules control outgoing traffic FROM the instance
  egress {
    from_port   = 0               # Allow all ports
    to_port     = 0               # Allow all ports
    protocol    = "-1"            # Allow all protocols (-1 means "all")
    cidr_blocks = ["0.0.0.0/0"]   # Allow to any destination
  }
}
