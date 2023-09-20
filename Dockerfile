# ใช้ Node.js 14 ในการสร้าง base image
FROM node:14

# ตั้งค่าไดเร็กทอรีที่จะให้ทำงาน
WORKDIR /usr/src/app

# Copy package.json และ package-lock.json ไปยังไดเร็กทอรีทำงาน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# Copy โค้ดทั้งหมดไปยังไดเร็กทอรีทำงาน
COPY . .

# ให้ Express.js ทำงานที่ port 5002
EXPOSE 5002

# คำสั่งสำหรับเริ่มต้น Express.js ด้วย nodemon
CMD ["npm", "start"]