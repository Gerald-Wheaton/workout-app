Follow these steps to create a git worktree.

1. Get the current project's folder name.

2. Check if a folder named `{current project folder name}-worktrees` already exists adjacent to the current project folder.

   - If it **exists**, return the name of that folder and the message:
     > "Worktree folder already exists. Use `/create-worktree-branch` to create a new worktree branch."

3. If the folder from step 2 does **not** exist, create it by following these steps:

   - Create a folder adjacent to the current project's folder and name it {current project folder name}-worktrees.
   - For example, if the current project folder is named myapp, create a folder called myapp-worktrees. Both myapp and myapp-worktrees should have the same parent folder.

4. Create a git worktree and branch named $ARGUMENTS from the main project folder and save it inside the {current project folder name}-worktrees folder that was created.
   - For example git worktree add -b $ARGUMENTS ../myapp-worktrees/$ARGUMENTS
