@echo off
echo Reseeding database...
node prisma/seed.js
echo Done!
pause
