# 마켓컬리 나만의 장바구니

API(NodeJS)

## System Architecture
- serverless cli 이용한 배포
   ```bash
   sls deploy
   ```
    ![Image](https://i.ibb.co/B4X5CzS/deploy.png)


- aws cloud micro architecture
    ![Image](https://i.ibb.co/kmsb8tZ/architecture.png)

## Get Started

#### Prerequisites
- [ ] NodeJS 설치
- [ ] Firebase 서비스 인증 파일(firebase.json)
- [ ] AWS 인증 파일(aws.json)
- [ ] Install Serverless (배포 위한 선택)
- [ ] Install AWS CLI (배포 위한 선택)

#### Installation
1. Clone the repo
   ```bash
   git clone https://github.com/Be-it-kurly/api
   ```
2. Install NPM packages
    ```bash
    npm i
    ```

#### Quick start
- local pc (http://localhost:3000)
    ```bash
    npm i & npm run dev
    ```
- external pc (https://b0yohyz722.execute-api.ap-northeast-2.amazonaws.com/dev)
    ```bash
    npm run deploy
    ```

## Roadmap
- [x] set express routes
- [x] set 3rd party(aws, firebase)
- [ ] upgrade api 'search receipt'

## Contact

Developer - kjh9519@naver.com
Developer - jeong9132@gmail.com

Project Link: [https://github.com/Be-it-kurly/api](https://github.com/Be-it-kurly/api)


