# Git Notes - Week 2

- Local vs remote:
  - A local repository is stored on your computer and contains your code, history, and changes. A remote repository (like one on GitHub) is an online copy used for collaboration or backup. Your local changes stay private until you push them with `git push` .

- Repo, commit, branch:
  - Repository (repo): this is your full project containing all tracked files and history.
  - Commit: a snapshot of your changes saved with a message, your name, and a unique ID.
  - Branch: an independent version of your code that lets you work on new features or fixes without messing up the main version.

- Staging area:
  - The staging area (also called the index) is where you prepare changes for your next commit using `git add`. It allows you to control exactly which files or parts of files to include. 
- Push vs pull:
  - `git push` sends your commits from your local repo to the remote one (for example, on GitHub).
  - `git pull` gets the newest commits from the remote and merges them into your local branch (it’s basically `git fetch` + `git merge`).

- What .gitignore does:
  - The `.gitignore` file tells Git which files or folders to ignore. Use it for temporary files, build outputs, system files, or sensitive data that you don’t want to upload.

- What a README is for:
  - A README explains what your project does, how to install and use it, and often how to contribute. It’s the first thing people see when they open your repo, so it should be clear and helpful.
