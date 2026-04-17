#!/bin/bash

APP_NAME="coreus"
APP_DIR="/opt/${APP_NAME}"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
SERVICE_USER="${APP_NAME}"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

show_help() {
    cat << EOF
${APP_NAME} - Simple File Server Installer

Usage: ${APP_NAME} [command]

Commands:
    install    Install and enable the systemd service
    uninstall  Stop, disable, and remove the systemd service
    help       Show this help message

Note: This script requires sudo privileges.
EOF
}

create_user_if_needed() {
    if ! id "${SERVICE_USER}" &>/dev/null; then
        echo "Creating user ${SERVICE_USER}..."
        sudo useradd --system --no-create-home --shell /usr/sbin/nologin "${SERVICE_USER}"
    fi
}

setup_directories() {
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${RED}Error: Application directory not found at $APP_DIR${NC}"
        echo "Please ensure the application is installed at $APP_DIR"
        exit 1
    fi

    if [ ! -f "$APP_DIR/server.js" ]; then
        echo -e "${RED}Error: server.js not found in $APP_DIR${NC}"
        exit 1
    fi

    echo "Setting ownership of $APP_DIR to ${SERVICE_USER}..."
    sudo chown -R "${SERVICE_USER}:${SERVICE_USER}" "$APP_DIR"
    
    NODE_BIN=$(command -v node)
    if [ -z "$NODE_BIN" ]; then
        echo -e "${RED}Error: 'node' command not found in PATH${NC}"
        exit 1
    fi
}

install_service() {
    echo "Installing ${APP_NAME} service..."
    
    create_user_if_needed
    setup_directories

    cat << EOF | sudo tee "$SERVICE_FILE" > /dev/null
[Unit]
Description=${APP_NAME} File Server
After=network.target

[Service]
Type=simple
User=${SERVICE_USER}
Group=${SERVICE_USER}
WorkingDirectory=${APP_DIR}
ExecStart=${NODE_BIN} ${APP_DIR}/server.js
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
ProtectSystem=strict
PrivateTmp=yes
NoNewPrivileges=yes
ReadWritePaths=${APP_DIR}

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable "${APP_NAME}"
    sudo systemctl start "${APP_NAME}"
    
    echo -e "${GREEN}${APP_NAME} service installed, enabled, and started!${NC}"
    echo "Logs can be viewed with: sudo journalctl -u ${APP_NAME} -f"
}

uninstall_service() {
    echo "Uninstalling ${APP_NAME} service..."
    
    if [ -f "$SERVICE_FILE" ]; then
        sudo systemctl stop "${APP_NAME}" 2>/dev/null || true
        sudo systemctl disable "${APP_NAME}" 2>/dev/null || true
        sudo rm -f "$SERVICE_FILE"
        sudo systemctl daemon-reload
        
        echo -e "${GREEN}${APP_NAME} service stopped and disabled.${NC}"
    else
        echo -e "${RED}${APP_NAME} service file not found. Nothing to uninstall.${NC}"
    fi
}

case "${1:-}" in
    install)
        if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
            echo -e "${RED}This script requires sudo privileges. Please run with sudo.${NC}"
            exit 1
        fi
        install_service
        ;;
    uninstall)
        if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
            echo -e "${RED}This script requires sudo privileges. Please run with sudo.${NC}"
            exit 1
        fi
        uninstall_service
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        exit 1
        ;;
esac
