# React 와 Electron 연결하기
## settings
### 1. yarn add --dev electron 설치
### 2. yarn start
### 3. package.json 에 main.js main 으로 설정
### 4. yarn run electron

***
## React 와 Electron 동시에 실행하기
### 1. yarn add --dev concurrently wait-on
> concurrently ( 프로세스 동시 실행 )
> 
> 일렉트론과 리엑트 프로세스를 동시에 실행하기 위해 사용
> 
> wait-on ( 프로세스 순차 실행 )
> 
> 프로세스 동시 수행시 한개의 프로세스가 완료되기를 기다리다 완료된 후 다음 프로세스를 수행하게 하기 위해 사용
