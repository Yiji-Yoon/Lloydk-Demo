FROM node:20

WORKDIR /app

# 패키지 파일 먼저 복사 (캐시용)
COPY package.json package-lock.json* ./

# 소스 복사
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]