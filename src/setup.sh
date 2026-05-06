curl -sL https://aka.ms/DevTunnelCliInstall | bash
err=$?
if [ $err -ne 0 ]
then
    chmod +x src/devtunnel
    sudo cp src/devtunnel /usr/local/bin
fi
source ~/.bashrc
sudo apt install nodejs
npx npm install nodemon
devtunnel user login -g
devtunnel create pipe
devtunnel port create pipe --port-number 6080