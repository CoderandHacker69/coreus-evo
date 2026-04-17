echo "======================================"
echo "Welcome to coreus installation process"
echo "======================================"
echo "Make sure to have npm, git and a systemd based linux system"
echo "Step 1: Clone repo (may take some time)"
git clone https://github.com/noodlelover1/coreus.git /etc/coreus
cd /etc/coreus
echo "Step 2: Install dependencies"
npm i
echo "Step 3: Make binary executable"
chmod +x binary.sh
echo "Step 4: Install binary"
sudo cp binary.sh /usr/bin/coreus
echo "====================================="
echo "Install done! Run \"coreus\" to start"
echo "====================================="
