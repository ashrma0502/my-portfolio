const README_URL = "https://raw.githubusercontent.com/ashrma0502/My-Projects/main/README.md";

export const fetchGithubData = async () => {
  const cached = sessionStorage.getItem('github_portfolio_data');
  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await fetch(README_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();

    const projectsMatch = text.match(/<!-- PROJECTS_JSON([\s\S]*?)PROJECTS_JSON_END -->/);
    const certsMatch = text.match(/<!-- CERTIFICATES_JSON([\s\S]*?)CERTIFICATES_JSON_END -->/);

    const projects = projectsMatch ? JSON.parse(projectsMatch[1].trim()) : [];
    const certificates = certsMatch ? JSON.parse(certsMatch[1].trim()) : [];

    const data = { projects, certificates };
    sessionStorage.setItem('github_portfolio_data', JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error("Failed to fetch or parse GitHub data:", error);
    return { projects: [], certificates: [] };
  }
};
