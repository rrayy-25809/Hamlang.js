var valuesdict = {};

function uploadFile() {
    // 파일 입력 요소 가져오기
    var fileInput = document.getElementById('fileInput');
    // 선택된 파일 가져오기 (첫 번째 파일만)
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(){
            var text = reader.result;
            console.log(text); // 파일의 내용을 콘솔에 출력
            document.getElementById("input").value = text;
        };
        reader.readAsText(file);
    }
}

function Code() {
    var codeInput = document.getElementById('input').value;
    var lines = codeInput.split('\n'); // 줄 단위로 분할  
    var outputDiv = document.getElementById('output');
    outputDiv.textContent = "";
    valuesdict = {};
    // 각 줄을 순회하며 처리
    lines.forEach(line => {
        // 이 부분에서 각 줄에 대한 처리를 할 수 있습니다.
        Type(line);
    });
}

function c_bool(boolStr) {
    if (boolStr.includes("==")) {
        let words = boolStr.split("==");
        if (Type(words[0]) === Type(words[1])) {
            return "진실";
        } else {
            return "거짓";
        }
    } else if (boolStr.includes("!=")) {
        let words = boolStr.split("!=");
        if (Type(words[0]) !== Type(words[1])) {
            return "진실";
        } else {
            return "거짓";
        }
    } else if (boolStr === "진실" || boolStr === "거짓") {
        return boolStr;
    } else {
        errorprint("이해할 수 없는 조건문입니다.");
    }
}
//code.includes("=")
function Type(code) {
    if (code.startsWith("#")) {
        return null; // 아무 것도 반환하지 않음을 명시적으로 표현
    } else if (code.startsWith(" ")) {
        return Type(code.slice(1)); // 변수 이름이 잘못 사용됨을 수정
    } else if (code.endsWith(" ")) {
        return Type(code.trimEnd());
    } else if (code.startsWith("반복 ")) {
        words = code.slice(3).split(":")
        for (let index = 0; index < parseInt(Type(words[0])); index++) {
            Type(words[1])
        }
    } else if (code.startsWith("만약 ")) {
        words = code.slice(3).split(":")
        if (c_bool(words[0]) == "진실") {
            return Type(words[1])
        }
    } else if (code.startsWith("출력 ")) {
        print(Type(code.slice(3)));
        return null;
    } else if (code.startsWith("질문 ")) {
        return Type(prompt(Type(code.slice(3)),Type(code.slice(3))))
    } else if (code.startsWith("변수 ")) {
        t = code.slice(3);
        let first_part = t.split(" ")[0];
        let remaining_part = t.slice(first_part.length + 1);
        if (remaining_part.startsWith("는 ")) {
            valuesdict[first_part] = Type(remaining_part.slice(2));
            return
        }else if (first_part in valuesdict){
            return Type(valuesdict[first_part]+Type(remaining_part))
        }else{
            errorprint(first_part+" (이)라는 변수는 선언된 적이 없습니다.");
        }
    }else if (["+", "-", "*", "/"].some(op => code.includes(op))) {
        if (["+", "-", "*", "/"].some(op => code.startsWith(op))) {
            return code[0] + Type(code.slice(1));
        }
        return String(eval(code));
    } else {
        return code
    }
}


function print(text) {
    var outputDiv = document.getElementById('output');
    outputDiv.classList.add("alert-primary");
    outputDiv.textContent += ">>" + text + "\n"; // 줄 바꿈 추가
}

function errorprint(text) {
    var outputDiv = document.getElementById('output');
    outputDiv.classList.add("alert-danger");
    outputDiv.textContent += ">>"+text + "\n"; // 기존 텍스트를 덮어쓰는 방식으로 수정
}