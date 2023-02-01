var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let loginId;
// 로그인
export function loginInit() {
    const main = document.querySelector('.main');
    const signIn = document.querySelector('#sign-in');
    const header = document.querySelector('.header');
    const id = document.querySelector('#id');
    const password = document.querySelector('#password');
    // Sign In 클릭시
    signIn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
        const req = {
            id: id.value,
            password: password.value,
        };
        loginId = id.value;
        fetch(`/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        })
            .then((res) => {
            if (res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            // 성공시 생성된 아이디가 반환됨
            if (data.result === 'OK') {
                alert('로그인 성공');
                // roomEnter();
                header.style.display = 'block';
                main.innerHTML = '';
            }
            else if (data.result === 'None') {
                alert('아이디를 입력하세요');
            }
            else {
                alert('없는 아이디 입니다');
            }
        }));
    }));
}
// 회원가입
export function signUpInit() {
    const signUp = document.querySelector('#sign-up');
    const signIn = document.querySelector('#sign-in');
    const id = document.querySelector('#id');
    const password = document.querySelector('#password');
    // Sign Up 클릭시
    signUp.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
        if (signUp.classList.contains('clicked')) {
            const req = {
                id: id.value,
                password: password.value,
            };
            fetch(`/signUp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req),
            })
                .then((res) => {
                if (res.status != 200) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                // 성공시 생성된 아이디가 반환됨
                if (data.result === 'OK') {
                    alert('회원가입 성공');
                    // roomEnter();
                }
                else if (data.result === 'Fail') {
                    alert('이미 있는 아이디 입니다');
                }
                else {
                    // 아이디 비밀번호 입력하지 않았을 때
                    alert('아이디와 비밀번호를 입력하세요');
                }
            }));
        }
        signUp.classList.toggle('clicked');
        if (signUp.classList.contains('clicked')) {
            signIn.style.display = 'none';
        }
        else {
            signIn.style.display = 'block';
        }
    }));
}
export function getLoginId() {
    return loginId;
}
