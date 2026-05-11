curl -sL https://aka.ms/DevTunnelCliInstall | bash
sudo apt update
sudo apt download nodejs
sudo dpkg -i --force-all nodejs*.deb
npx npm install jsdom
npx npm install express
npx npm install path
npx npm install nodemon
devtunnel user login -g
devtunnel create pipe
devtunnel port create pipe --port-number 6080
