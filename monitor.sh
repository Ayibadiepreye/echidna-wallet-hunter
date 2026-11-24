#!/bin/bash

##############################################
# Echidna Performance Monitor
# Shows real-time stats and health check
##############################################

echo "🦔 Echidna Performance Monitor"
echo "==============================="
echo ""

# Check if PM2 is running
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 not installed"
    exit 1
fi

# Check if echidna is running
if ! pm2 status | grep -q "echidna"; then
    echo "❌ Echidna is not running"
    echo "Start it with: pm2 start src/server.js --name echidna"
    exit 1
fi

echo "📊 Application Status:"
pm2 status echidna
echo ""

echo "💻 System Resources:"
echo "   CPU Cores: $(nproc)"
echo "   Total RAM: $(free -h | awk '/^Mem:/ {print $2}')"
echo "   Used RAM: $(free -h | awk '/^Mem:/ {print $3}')"
echo "   Free RAM: $(free -h | awk '/^Mem:/ {print $4}')"
echo ""

echo "📈 Recent Performance (last 50 lines):"
echo "--------------------------------------"
pm2 logs echidna --lines 50 --nostream | grep -E "Checked batch|wallets/sec|rate limit|429|error|Error" | tail -20
echo ""

echo "🔍 Analyzing performance..."
echo ""

# Count rate limits in last 100 lines
RATE_LIMITS=$(pm2 logs echidna --lines 100 --nostream | grep -c "429" || echo "0")
ERRORS=$(pm2 logs echidna --lines 100 --nostream | grep -ic "error" || echo "0")

echo "⚠️  Issues in last 100 log lines:"
echo "   Rate Limits (429): $RATE_LIMITS"
echo "   Errors: $ERRORS"
echo ""

if [ "$RATE_LIMITS" -gt 10 ]; then
    echo "🚨 HIGH RATE LIMITING DETECTED!"
    echo "   Recommendation: Reduce PARALLEL_BATCHES in src/engine.js"
    echo "   Current config: $(grep PARALLEL_BATCHES /opt/echidna/src/engine.js || echo 'Not found')"
    echo "   Try: 100 or 150 instead of 200"
    echo ""
elif [ "$RATE_LIMITS" -gt 5 ]; then
    echo "⚠️  Moderate rate limiting. Monitor this."
    echo ""
else
    echo "✅ Rate limiting is under control"
    echo ""
fi

if [ "$ERRORS" -gt 10 ]; then
    echo "🚨 HIGH ERROR RATE!"
    echo "   Check full logs: pm2 logs echidna"
    echo ""
elif [ "$ERRORS" -gt 5 ]; then
    echo "⚠️  Some errors detected. Review logs."
    echo ""
else
    echo "✅ Error rate is normal"
    echo ""
fi

echo "🎯 Estimated Daily Performance:"
echo "-------------------------------"

# Try to calculate wallets/sec from recent logs
RECENT_RATE=$(pm2 logs echidna --lines 50 --nostream | grep -oP '\d+\.\d+ wallets/sec' | tail -1 | grep -oP '\d+\.\d+' || echo "0")

if [ "$RECENT_RATE" != "0" ]; then
    DAILY=$(echo "$RECENT_RATE * 86400 / 1000000" | bc -l)
    printf "   Current rate: %.2f wallets/sec\n" $RECENT_RATE
    printf "   Daily estimate: %.2f million wallets/day\n" $DAILY
    
    if (( $(echo "$DAILY > 1000" | bc -l) )); then
        BILLIONS=$(echo "$DAILY / 1000" | bc -l)
        printf "   Daily estimate: %.2f BILLION wallets/day 🚀\n" $BILLIONS
    fi
else
    echo "   No recent rate data available"
    echo "   App may still be starting up..."
fi

echo ""
echo "📋 Quick Actions:"
echo "   pm2 logs echidna          # View live logs"
echo "   pm2 restart echidna       # Restart app"
echo "   pm2 monit                 # Real-time CPU/RAM monitor"
echo "   bash monitor.sh           # Run this script again"
echo ""
echo "Press Ctrl+C to exit"
echo ""

# Offer to tail logs
read -p "Show live logs? (y/n): " SHOW_LOGS
if [ "$SHOW_LOGS" = "y" ]; then
    pm2 logs echidna
fi
