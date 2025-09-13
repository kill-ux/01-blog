mkdir ~/.npm_global
npm config set prefix '~/.npm_global'
echo 'export PATH=~/.npm_global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g @angular/cli