variable "aws_region" {
  type = string
  description = "The AWS Region to deploy into"
}


variable "ami_id" {
  type = string
  description = "AMI ID of the EC2 instance"
}

variable "key_name" {
  type = string
  description = "aws-hello-ec2"
}