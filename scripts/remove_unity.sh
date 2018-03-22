# https://stackoverflow.com/questions/10067848/remove-folder-and-its-contents-from-git-githubs-history

# git filter-branch # --index-filter \ # rewrite the index with following command. doesn't check out the tree, faster than tree-filter
# 'git rm -rf --cached --ignore-unmatch unity/' \ # remove unity/ from the index -r recursive -f force --cached only the index, not working tree --ignore-unmatch okay if no match
# --prune-empty \ # remove commits left empty by this
# --tag-name-filter cat \ # update tags in place (new name is old name)
# -- \ # this -- seperates the following options from the previous ones. following options are for the rev-list
# --all # revise all 

TARGET=images/environment_studio.rgbe

git filter-branch --index-filter "git rm -rf --cached --ignore-unmatch $TARGET" --prune-empty --tag-name-filter cat -- --all

# git for-each-ref --format="%(refname)" refs/original/ \ # find all refs matching refs/orignal
# | \ # pipe them to xargs
# xargs -n 1 git update-ref -d

git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 echo git update-ref -d


# Ensure all old refs are fully removed
rm -Rf .git/logs .git/refs/original


# Perform a garbage collection to remove commits with no refs
git gc --prune=all --aggressive


#git push origin --all --force
#git push origin --tags --force