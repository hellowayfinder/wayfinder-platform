import json
import requests

with open("scripts/config.json") as f:
    config = json.load(f)

token = input("GitHub Personal Access Token: ").strip()

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github+json"
}

url = f"https://api.github.com/repos/{config['owner']}/{config['repo']}"

response = requests.get(url, headers=headers)

if response.status_code != 200:
    print("❌ Unable to connect.")
    print(response.text)
    exit()

repo = response.json()

print("\n✅ Connected Successfully!\n")

print("Repository :", repo["full_name"])
print("Default Branch :", repo["default_branch"])
print("Visibility :", repo["visibility"])
print("Open Issues :", repo["open_issues_count"])