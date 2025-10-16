Follow these steps to create a new git worktree branch when a worktree folder already exists.

1. Get the current project's folder name.

2. Confirm that a folder named `{current project folder name}-worktrees` exists adjacent to the project folder.

   - If it does **not** exist, return:
     > "No existing worktree folder found. Run `/create-worktree` first."

3. From the main project folder, create a new git worktree and branch named $ARGUMENTS inside the existing `{current project folder name}-worktrees` folder.  
   Example: git worktree add ../{current project folder name}-worktrees/$ARGUMENTS -b $ARGUMENTS
