#!/bin/bash

# Ruta al archivo de estado
CRONO_FILE="crono.dat"

start() {
    date +%s.%N > "$CRONO_FILE"
    echo "Cronómetro iniciado."
}

stop() {
    if [[ ! -f "$CRONO_FILE" ]]; then
        echo "Cronómetro no iniciado."
        exit 1
    fi
    START=$(cat "$CRONO_FILE")
    END=$(date +%s.%N)
    DURATION=$(echo "$END - $START" | bc)
    echo "[*] Tomó: $DURATION segundos"
    rm -f "$CRONO_FILE"
}

print() {
    if [[ ! -f "$CRONO_FILE" ]]; then
        echo "Cronómetro no iniciado."
        exit 1
    fi
    START=$(cat "$CRONO_FILE")
    NOW=$(date +%s.%N)
    ELAPSED=$(echo "$NOW - $START" | bc)
    echo "$ELAPSED"
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    print)
        print
        ;;
    *)
        echo "Uso: $0 {start|stop|print}"
        exit 1
        ;;
esac
