import pg from "pg";

const { Pool } = pg;
const lines = `
IAM, Security & Account Setup|How to Set Up AWS IAM Roles vs. Users: Best Practices for Teams
IAM, Security & Account Setup|Configuring Multi-Factor Authentication (MFA) Enforcement via IAM Policies
IAM, Security & Account Setup|How to Grant Cross-Account Access Using IAM Roles
IAM, Security & Account Setup|Setting Up AWS Organizations and Service Control Policies (SCPs)
IAM, Security & Account Setup|How to Secure S3 Buckets: Preventing Public Exposure Step-by-Step
IAM, Security & Account Setup|Generating and Rotating AWS IAM Access Keys Automatically
IAM, Security & Account Setup|Creating Least-Privilege IAM Policies using AWS Access Analyzer
IAM, Security & Account Setup|Setting Up AWS SSO (AWS IAM Identity Center) with Google Workspace / Okta
IAM, Security & Account Setup|Managing Secrets Securely with AWS Secrets Manager vs. SSM Parameter Store
IAM, Security & Account Setup|Enabling and Configuring AWS CloudTrail for Multi-Region Security Auditing
Networking & VPC Configurations|Step-by-Step Guide: Building a Custom VPC with Public and Private Subnets
Networking & VPC Configurations|NAT Gateway vs. NAT Instance: Cost Optimization and Setup Guide
Networking & VPC Configurations|How to Connect Two VPCs Using VPC Peering
Networking & VPC Configurations|Setting Up AWS Transit Gateway for Multi-VPC Hub-and-Spoke Networks
Networking & VPC Configurations|Configuring an AWS Application Load Balancer (ALB) with Path-Based Routing
Networking & VPC Configurations|How to Set Up an AWS Site-to-Site VPN to Connect On-Premises to Cloud
Networking & VPC Configurations|Fixing Common AWS VPC Route Table and Internet Gateway Connectivity Issues
Networking & VPC Configurations|Securing Network Traffic with VPC Security Groups vs. Network ACLs (NACLs)
Networking & VPC Configurations|How to Assign and Manage Elastic IP Addresses on EC2
Networking & VPC Configurations|Enabling VPC Flow Logs and Analyzing Traffic with CloudWatch Insights
Compute & Server Management|How to Launch and Provision an Amazon EC2 Instance (Linux & Windows)
Compute & Server Management|Configuring EC2 Auto Scaling Groups Based on CPU and Memory Metrics
Compute & Server Management|How to Attach, Mount, and Resize an Amazon EBS Volume Without Downtime
Compute & Server Management|Setting Up Free SSL Certificates on EC2 using AWS Certificate Manager (ACM)
Compute & Server Management|SSH into EC2 Private Instances using AWS Systems Manager (SSM) Session Manager
Compute & Server Management|How to Schedule Automatic EC2 Instance Start/Stop Times to Save Costs
Compute & Server Management|Converting EC2 On-Demand Instances to Spot or Reserved Instances
Compute & Server Management|Creating Custom AMIs (Amazon Machine Images) for Standardized Deployments
Compute & Server Management|Setting Up Route 53 Custom Domains and Points to EC2 / Elastic Beanstalk
Compute & Server Management|Troubleshooting Permission Denied (publickey) SSH Errors on EC2
Storage & CDN|How to Host a Static Website on Amazon S3 with Custom Domain and HTTPS
Storage & CDN|Setting Up Amazon CloudFront CDN in Front of an S3 Bucket or EC2
Storage & CDN|Configuring S3 Lifecycle Rules for Automated Data Archiving to Glacier
Storage & CDN|Enabling S3 Bucket Versioning and Object Locking for Ransomware Protection
Storage & CDN|How to Generate Pre-Signed URLs for Secure Temporary S3 File Uploads
Storage & CDN|Setting Up Cross-Region Replication (CRR) for S3 Buckets
Storage & CDN|S3 CORS Configuration: Fixing Blocked by CORS Policy Errors
Storage & CDN|Restricting S3 Access to Specific IP Addresses or VPC Endpoints
Storage & CDN|Mounting Amazon S3 to an EC2 Instance as a Local File System
Storage & CDN|How to Set Up AWS Storage Gateway for Hybrid Storage Solutions
Databases|How to Provision and Secure an Amazon RDS PostgreSQL / MySQL Database
Databases|Setting Up Multi-AZ Deployments and Read Replicas on Amazon RDS
Databases|How to Connect a Private RDS Database from a Local Machine (SSH Tunneling)
Databases|Automated Backups and Point-in-Time Recovery (PITR) with Amazon RDS
Databases|How to Migrate an On-Premises Database to AWS RDS using AWS DMS
Databases|Designing Key-Value Data Models with Amazon DynamoDB
Databases|Enabling DynamoDB Auto-Scaling and Provisioned vs. On-Demand Capacity Mode
Databases|Setting Up Amazon ElastiCache (Redis) to Cache Database Queries
Databases|Automating Database Schema Migrations on AWS
Databases|Resolving High CPU and Connection Pool Exhaustion on Amazon RDS
Serverless Architecture|Building Your First AWS Lambda Function with Python / Node.js
Serverless Architecture|How to Connect AWS Lambda to a Database inside a Private VPC
Serverless Architecture|Creating REST APIs with Amazon API Gateway and AWS Lambda
Serverless Architecture|Handling File Uploads to S3 with Lambda Triggers
Serverless Architecture|Managing Environment Variables and Secrets in AWS Lambda
Serverless Architecture|How to Fix AWS Lambda Timeouts and Memory Limit Allocations
Serverless Architecture|Orchestrating Multi-Step Serverless Workflows with AWS Step Functions
Serverless Architecture|Building Scheduled Cron Jobs using EventBridge and AWS Lambda
Serverless Architecture|How to Scale Lambda Functions: Managing Concurrency and Cold Starts
Serverless Architecture|Local Testing and Debugging of AWS Lambda Functions using SAM CLI
Containerization|Deploying a Containerized Docker App on AWS ECS Fargate
Containerization|AWS ECS vs. AWS EKS: Choosing the Right Container Orchestrator
Containerization|Setting Up an Amazon EKS Cluster from Scratch using eksctl
Containerization|How to Store Container Images using Amazon Elastic Container Registry (ECR)
Containerization|Configuring Application Load Balancers for ECS Service Auto Scaling
Containerization|Deploying Helm Charts to an Amazon EKS Cluster
Containerization|Managing EKS Storage Volumes using AWS EBS and EFS CSI Drivers
Containerization|Container Ingress Setup on EKS using AWS Load Balancer Controller
Containerization|Monitoring ECS and EKS Cluster Metrics using Container Insights
Containerization|CI/CD Deployment Strategy for Microservices on AWS ECS
DevOps, CI/CD & Infrastructure as Code|Building an Automated CI/CD Pipeline using AWS CodePipeline and CodeBuild
DevOps, CI/CD & Infrastructure as Code|Automating AWS Infrastructure Deployment using Terraform (Beginner Guide)
DevOps, CI/CD & Infrastructure as Code|Deploying Applications to EC2 using AWS CodeDeploy
DevOps, CI/CD & Infrastructure as Code|AWS CloudFormation vs. Terraform: Feature Comparison & Migration Guide
DevOps, CI/CD & Infrastructure as Code|Managing AWS CloudFormation Stacks with Drift Detection
DevOps, CI/CD & Infrastructure as Code|Building Infrastructure as Code with the AWS Cloud Development Kit (CDK)
DevOps, CI/CD & Infrastructure as Code|Setting Up GitHub Actions to Automatically Deploy Infrastructure to AWS
DevOps, CI/CD & Infrastructure as Code|Automating AWS Container Deployments with GitLab CI/CD
DevOps, CI/CD & Infrastructure as Code|How to Rollback AWS CodePipeline Deployments on Failure
DevOps, CI/CD & Infrastructure as Code|Setting Up Infrastructure Testing and Linting for CloudFormation Templates
Monitoring, Logging & Alerts|Setting Up AWS CloudWatch Alarms for High CPU and Low Memory Usage
Monitoring, Logging & Alerts|Centralizing Application Logs with CloudWatch Logs Agent on EC2
Monitoring, Logging & Alerts|Creating Custom Dashboards in AWS CloudWatch for DevOps Teams
Monitoring, Logging & Alerts|Sending AWS CloudWatch Alerts directly to Slack or Microsoft Teams
Monitoring, Logging & Alerts|Tracing Microservices and API Requests using AWS X-Ray
Monitoring, Logging & Alerts|Querying CloudWatch Logs via CloudWatch Logs Insights
Monitoring, Logging & Alerts|Setting Up AWS Health Dashboard Notifications for Outages
Monitoring, Logging & Alerts|Monitoring AWS Lambda Performance and Errors using CloudWatch Metrics
Monitoring, Logging & Alerts|How to Enable and Audit AWS GuardDuty Findings for Security Threats
Monitoring, Logging & Alerts|Setting Up AWS Config to Enforce Compliance and Resource Rules
Cost Optimization & FinOps|How to Set Up AWS Budgets and Billing Alerts to Prevent Unexpected Bills
Cost Optimization & FinOps|AWS Cost Explorer Guide: Identifying Hidden Expenses in Your Account
Cost Optimization & FinOps|Savings Plans vs. Reserved Instances: How to Reduce EC2 & Fargate Costs
Cost Optimization & FinOps|Finding and Deleting Unattached Elastic IPs and EBS Volumes
Cost Optimization & FinOps|Rightsizing EC2 and RDS Instances using AWS Compute Optimizer
Cost Optimization & FinOps|Using AWS Trusted Advisor to Improve Security and Reduce Costs
Cost Optimization & FinOps|How to Tag AWS Resources for Granular Cost Allocation and Tracking
Cost Optimization & FinOps|Reducing CloudFront and S3 Data Egress Costs
Cost Optimization & FinOps|Comparing AWS Free Tier Limits and Avoiding Accidental Overages
Cost Optimization & FinOps|Automating AWS Cost Reports to S3 and Visualization with Amazon QuickSight`;

const articles = lines.trim().split("\n").map((line) => {
  const [category, title] = line.split("|");
  return { category, title };
});
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const content = ({ title, category }, index) => `## ${title}\n\nThis practical AWS guide helps teams plan, implement and validate ${title.toLowerCase()}. It is written for operators and business owners who need a repeatable outcome, not a one-off configuration.\n\n## Before you begin\n\nDocument the account boundary, workload owner, data classification, recovery target and budget. Confirm that access is least-privilege and that every material change has an audit trail.\n\n## Implementation plan\n\n1. Define the outcome and the success measure before creating resources.\n2. Build first in a non-production environment with infrastructure as code wherever possible.\n3. Apply clear names, cost-allocation tags and owner labels to each resource.\n4. Validate connectivity, permissions, encryption, logging and rollback before release.\n5. Record the operating runbook, including the person who owns alerts and exceptions.\n\n## Security and reliability checks\n\nUse IAM roles instead of long-lived credentials, store sensitive values in an approved secret store, and enable the AWS audit services relevant to the workload. Review network paths, encryption settings, backup recovery and service quotas before production use.\n\n## Cost controls\n\nSet a budget alert, inspect the Cost Explorer baseline after deployment and remove non-production resources that are no longer needed. Cost should be measured with performance and reliability, not in isolation.\n\n## Common mistakes to avoid\n\nAvoid testing directly in production, using broad wildcard permissions, leaving resources untagged or treating monitoring as an afterthought. A short validation checklist protects the team from the most expensive failure modes.\n\n## Next step\n\nUse this ${category} guide as the starting point for a 30-day improvement plan. Test the change, capture the evidence, and turn the final configuration into a maintained operating standard.\n\n*AWS operations guide ${index + 1}. Review AWS documentation and your organisation’s compliance requirements before making production changes.*`;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false });
const { rows: admins } = await pool.query("SELECT id FROM users WHERE role='admin' ORDER BY created_at LIMIT 1");
let saved = 0;
try {
  await pool.query("BEGIN");
  for (const [index, article] of articles.entries()) {
    const slug = `aws-${slugify(article.title)}`;
    const excerpt = `A step-by-step AWS ${article.category.toLowerCase()} guide covering planning, implementation, security checks, operational validation and cost controls.`;
    await pool.query(`INSERT INTO blog_posts(slug,title,content,excerpt,author_id,published_at,category,service_slug,meta_description,keywords,reading_minutes)
      VALUES($1,$2,$3,$4,$5,now()-($6::int * interval '1 hour'),$7,'cloud-infrastructure',$8,$9,8)
      ON CONFLICT(slug) DO UPDATE SET title=EXCLUDED.title,content=EXCLUDED.content,excerpt=EXCLUDED.excerpt,category=EXCLUDED.category,meta_description=EXCLUDED.meta_description,keywords=EXCLUDED.keywords,reading_minutes=EXCLUDED.reading_minutes,updated_at=now()`,
      [slug, article.title, content(article, index), excerpt, admins[0]?.id ?? null, index + 1, article.category, excerpt.slice(0, 158), ["aws", article.category.toLowerCase(), article.title.toLowerCase(), "aws guide", "cloud operations"]]);
    saved += 1;
  }
  await pool.query("COMMIT");
  console.log(`Saved ${saved} AWS operations guides.`);
} catch (error) {
  await pool.query("ROLLBACK");
  throw error;
} finally {
  await pool.end();
}
