// Skill badge data → rendered as shields.io flat-square badges by main.js.
// Keyed by the data-cat on each .chips span. {n:name, c:hex color, l:simple-icons logo slug (optional)}
export const SKILLS = {
  languages: [
    { n:"Python", c:"3776AB", l:"python" },
    { n:"C++", c:"00599C", l:"cplusplus" },
    { n:"TypeScript", c:"3178C6", l:"typescript" },
  ],
  backend: [
    { n:"Django", c:"092E20", l:"django" },
    { n:"FastAPI", c:"009688", l:"fastapi" },
    { n:"NestJS", c:"E0234E", l:"nestjs" },
  ],
  database: [
    { n:"PostgreSQL", c:"4169E1", l:"postgresql" },
    { n:"MongoDB", c:"47A248", l:"mongodb" },
    { n:"Redis", c:"FF4438", l:"redis" },
  ],
  cloud: [
    { n:"AWS", c:"232F3E", l:"amazonwebservices" },
    { n:"Amazon EC2", c:"FF9900", l:"amazonec2" },
    { n:"Amazon EKS", c:"FF9900", l:"amazoneks" },
    { n:"Amazon ECS", c:"FF9900", l:"amazonecs" },
    { n:"AWS Lambda", c:"FF9900", l:"awslambda" },
    { n:"Amazon S3", c:"569A31", l:"amazons3" },
    { n:"Amazon SQS", c:"FF9900" },
    { n:"Amazon SNS", c:"FF9900" },
    { n:"Bedrock", c:"FF9900" },
  ],
  infra: [
    { n:"Kubernetes", c:"326CE5", l:"kubernetes" },
    { n:"RKE2", c:"0075A8", l:"rancher" },
    { n:"Docker", c:"2496ED", l:"docker" },
    { n:"Terraform", c:"844FBA", l:"terraform" },
    { n:"AWS CDK", c:"232F3E", l:"amazonwebservices" },
    { n:"Rancher", c:"0075A8", l:"rancher" },
  ],
  mlops: [
    { n:"Ray", c:"028CF0", l:"ray" },
    { n:"KubeRay", c:"028CF0" },
    { n:"MLflow", c:"0194E2", l:"mlflow" },
    { n:"KServe", c:"326CE5" },
    { n:"Knative", c:"0865AD", l:"knative" },
    { n:"lakeFS", c:"24C3D9" },
  ],
  cicd: [
    { n:"ArgoCD", c:"EF7B4D", l:"argo" },
    { n:"GitHub Actions", c:"2088FF", l:"githubactions" },
    { n:"Harbor", c:"60B932", l:"harbor" },
    { n:"Helm", c:"0F1689", l:"helm" },
    { n:"Airflow", c:"017CEE", l:"apacheairflow" },
  ],
  monitoring: [
    { n:"Grafana", c:"F46800", l:"grafana" },
    { n:"Prometheus", c:"E6522C", l:"prometheus" },
    { n:"Loki", c:"F5A800", l:"grafana" },
    { n:"Datadog", c:"632CA6", l:"datadog" },
  ],
  ai: [
    { n:"Claude Code", c:"D97757", l:"claude" },
    { n:"Gemini CLI", c:"8E75B2", l:"googlegemini" },
    { n:"Codex", c:"412991", l:"openai" },
    { n:"MCP", c:"1F1F1F", l:"modelcontextprotocol" },
    { n:"AWS Bedrock", c:"FF9900", l:"amazonwebservices" },
    { n:"n8n", c:"EA4B71", l:"n8n" },
  ],
  tools: [
    { n:"Git", c:"F05032", l:"git" },
    { n:"Jira", c:"0052CC", l:"jira" },
    { n:"Confluence", c:"172B4D", l:"confluence" },
    { n:"Atlassian API", c:"0052CC", l:"atlassian" },
  ],
};

// shields.io label encoding: '-' → '--', '_' → '__', ' ' → '%20', '+' → '%2B'
function enc(s){
  return s.replace(/-/g,"--").replace(/_/g,"__").replace(/ /g,"%20").replace(/\+/g,"%2B");
}

export function badgeURL({ n, c, l }){
  const logo = l ? `&logo=${l}&logoColor=white` : "";
  return `https://img.shields.io/badge/${enc(n)}-${c}?style=flat-square${logo}`;
}
