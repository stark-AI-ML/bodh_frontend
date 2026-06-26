#!/bin/bash

options=("Option 1" "Option 2" "Option 3" "Quit")
selected=0

while true; do
    clear
    echo "Use ↑ ↓ and Enter to select:"
    for i in "${!options[@]}"; do
        if [[ $i -eq $selected ]]; then
            # Highlight selected option in green
            echo -e "\033[32m> ${options[$i]}\033[0m"
        else
            echo "  ${options[$i]}"
        fi
    done

    # Read key
    read -rsn1 key
    case "$key" in
        $'\x1b') # Arrow keys start with ESC
            read -rsn2 key
            case "$key" in
                '[A') ((selected--)) ;; # Up
                '[B') ((selected++)) ;; # Down
            esac
            ;;
        "") # Enter
            echo "You selected: ${options[$selected]}"
            [[ ${options[$selected]} == "Quit" ]] && break
            read -n1 -s -r -p "Press any key to continue..."
            ;;
    esac

    # Wrap around
    ((selected < 0)) && selected=$((${#options[@]} - 1))
    ((selected >= ${#options[@]})) && selected=0
done
