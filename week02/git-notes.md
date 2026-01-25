# Git Notes - Week 2

- Local vs remote:
  - A local repository lives on your computer and contains your working files and history. A remote repository (e.g., on GitHub) is a hosted copy used for collaboration and backup. Changes in your local repo are not visible to others until you push them to the remote.

- Repo, commit, branch:
  - Repository (repo): the full project history and files tracked by Git.
  - Commit: a saved snapshot of changes with a message, author, and unique ID.
  - Branch: an independent line of development allowing you to work on features or fixes without affecting other branches.

- Staging area:
  - The staging area (index) is where you place changes with `git add` to prepare exactly what will go into the next commit. It lets you build commits from specific files or hunks.

- Push vs pull:
  - `git push` sends your local commits to a remote repository so others can access them.
  - `git pull` fetches commits from the remote and merges them into your current local branch (it is equivalent to `git fetch` followed by `git merge` by default).

- What .gitignore does:
  - A `.gitignore` file lists files and patterns Git should ignore when tracking changes. Use it to exclude build artifacts, temporary files, credentials, and other files that should not be committed.

- What a README is for:
  - A README describes the project purpose, how to set it up, usage instructions, dependencies, and contribution guidelines. It helps others (and future you) understand and run the project.
