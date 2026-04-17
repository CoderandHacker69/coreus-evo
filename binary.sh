#!/bin/bash

COREUS_DIR="/etc/coreus"
SERVICE_FILE="/etc/systemd/system/coreus.service"

show_help() {
    cat << EOF
Coreus - Simple File Server

Usage: coreus [command]

Commands:
    install    Install and enable the systemd service
    uninstall  Stop and remove the systemd service
    help       Show this help message

EOF
}

install_service() {
    if [ ! -d "$COREUS_DIR" ]; then
        echo "Error: coreus directory not found at $COREUS_DIR"
        exit 1
    fi

    if [ ! -f "$COREUS_DIR/server.js" ]; then
        echo "Error: server.js not found in $COREUS_DIR"
        exit 1
    fi

    cat << EOF | sudo tee "$SERVICE_FILE" > /dev/null
[Unit]
Description=Coreus File Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$COREUS_DIR
ExecStart=$(command -v node) $COREUS_DIR/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable coreus
    sudo systemctl start coreus
    echo "Coreus service installed and started!"
}

uninstall_service() {
    if [ -f "$SERVICE_FILE" ]; then
        sudo systemctl stop coreus 2>/dev/null
        sudo systemctl disable coreus 2>/dev/null
        sudo rm "$SERVICE_FILE"
        sudo systemctl daemon-reload
        echo "Coreus service uninstalled!"
    else
        echo "Coreus service not found!"
    fi
}

case "${1:-}" in
    install)
        install_service
        ;;
    uninstall)
        uninstall_service
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
