import os
import json
from typing import Dict
from dotenv import load_dotenv
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai.foundation_models import ModelInference

# Load environment variables
load_dotenv()

# Watsonx credentials
WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_URL = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")

# Model configuration
MODEL_ID = "ibm/granite-8b-code-instruct"

# Initialize API client
credentials = {
    "url": WATSONX_URL,
    "apikey": WATSONX_API_KEY
}

client = APIClient(credentials)


def _get_model_inference():
    """Initialize model inference with project ID."""
    return ModelInference(
        model_id=MODEL_ID,
        api_client=client,
        project_id=WATSONX_PROJECT_ID,
        params={
            "decoding_method": "greedy",
            "max_new_tokens": 2000,
            "temperature": 0.1,
            "repetition_penalty": 1.0
        }
    )


def _extract_json_from_response(response_text: str) -> dict:
    """
    Extract JSON from response text, handling markdown code blocks.
    
    Args:
        response_text: Raw response text from the model
        
    Returns:
        Parsed JSON dictionary
    """
    # Remove markdown code blocks if present
    text = response_text.strip()
    
    # Remove ```json and ``` markers
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    
    if text.endswith("```"):
        text = text[:-3]
    
    text = text.strip()
    
    # Parse JSON
    return json.loads(text)


async def analyze_architecture(file_tree: dict, dependency_graph: dict) -> dict:
    """
    Analyze repository architecture and identify critical files with risk scores.
    
    Args:
        file_tree: Dictionary representing the file structure
        dependency_graph: Dictionary with nodes and edges representing dependencies
        
    Returns:
        Dictionary with critical files, risk scores (0-100), and explanations
        Format: {
            "critical_files": [
                {
                    "file": "path/to/file",
                    "risk_score": 85,
                    "explanation": "High risk due to..."
                }
            ]
        }
    """
    try:
        model = _get_model_inference()
        
        prompt = f"""You are a code architecture analyzer. Analyze the following repository structure and dependency graph.

File Tree:
{json.dumps(file_tree, indent=2)}

Dependency Graph:
{json.dumps(dependency_graph, indent=2)}

Identify critical files and assign risk scores (0-100) based on:
- Number of dependencies (files that depend on this file)
- Complexity and centrality in the architecture
- Potential impact if modified

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{{
  "critical_files": [
    {{
      "file": "path/to/file",
      "risk_score": 85,
      "explanation": "High risk due to multiple dependencies and central role"
    }}
  ]
}}"""

        response = model.generate_text(prompt=prompt)
        result = _extract_json_from_response(response)
        
        return result
        
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse JSON response: {str(e)}",
            "critical_files": []
        }
    except Exception as e:
        return {
            "error": f"Analysis failed: {str(e)}",
            "critical_files": []
        }


async def generate_checklist(repo_context: dict) -> dict:
    """
    Generate a testing checklist based on repository context.
    
    Args:
        repo_context: Dictionary containing repository structure and metadata
        
    Returns:
        Dictionary with done, todo, and suggestions lists
        Format: {
            "done": ["Item 1", "Item 2"],
            "todo": ["Task 1", "Task 2"],
            "suggestions": ["Suggestion 1", "Suggestion 2"]
        }
    """
    try:
        model = _get_model_inference()
        
        prompt = f"""You are a software testing expert. Based on the following repository context, generate a comprehensive testing checklist.

Repository Context:
{json.dumps(repo_context, indent=2)}

Analyze the repository and create a checklist with:
- done: Tasks that appear to be completed (e.g., existing tests, documentation)
- todo: Essential testing tasks that should be performed
- suggestions: Additional recommendations for improving code quality

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{{
  "done": ["Existing unit tests found", "API documentation present"],
  "todo": ["Test edge cases", "Add integration tests", "Verify error handling"],
  "suggestions": ["Consider adding E2E tests", "Implement code coverage tracking"]
}}"""

        response = model.generate_text(prompt=prompt)
        result = _extract_json_from_response(response)
        
        return result
        
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse JSON response: {str(e)}",
            "done": [],
            "todo": [],
            "suggestions": []
        }
    except Exception as e:
        return {
            "error": f"Checklist generation failed: {str(e)}",
            "done": [],
            "todo": [],
            "suggestions": []
        }


async def predict_impact(changed_file: str, dependency_graph: dict) -> dict:
    """
    Predict the impact of changes to a specific file.
    
    Args:
        changed_file: Path to the file that was changed
        dependency_graph: Dictionary with nodes and edges representing dependencies
        
    Returns:
        Dictionary with affected modules and recommendations
        Format: {
            "affected_modules": [
                {
                    "name": "module/path",
                    "risk": "HIGH",
                    "reason": "Direct dependency with critical functionality"
                }
            ],
            "recommendation": "Test all affected modules thoroughly..."
        }
    """
    try:
        model = _get_model_inference()
        
        prompt = f"""You are a code impact analyzer. Analyze the impact of changes to a specific file.

Changed File: {changed_file}

Dependency Graph:
{json.dumps(dependency_graph, indent=2)}

Identify all modules affected by changes to this file. For each affected module, provide:
- name: The module path
- risk: Risk level (HIGH, MEDIUM, or LOW)
- reason: Why this module is affected

Also provide an overall recommendation for testing and deployment.

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{{
  "affected_modules": [
    {{
      "name": "path/to/module",
      "risk": "HIGH",
      "reason": "Direct dependency with critical functionality"
    }}
  ],
  "recommendation": "Test all affected modules thoroughly before deployment. Focus on integration tests."
}}"""

        response = model.generate_text(prompt=prompt)
        result = _extract_json_from_response(response)
        
        return result
        
    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse JSON response: {str(e)}",
            "affected_modules": [],
            "recommendation": "Unable to generate recommendation due to parsing error"
        }
    except Exception as e:
        return {
            "error": f"Impact prediction failed: {str(e)}",
            "affected_modules": [],
            "recommendation": "Unable to generate recommendation due to error"
        }


# Made with Bob