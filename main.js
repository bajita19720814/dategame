'use strict';
{
  const instruction = document.getElementById('instruction');
  const question1 = document.getElementById('question1');
  const question2 = document.getElementById('question2');
  const choicesarea = document.getElementById('choicesarea');
  const result = document.getElementById('result');
  const result_correct = document.getElementById('result_correct');
  const result_score = document.getElementById('result_score');
  const replay = document.getElementById('replay');  
  let correctCount = 0;
  let quizCount = 0;
  let startTime; 
  let isGaming = false;
  const AorP = ["AM", "PM"];
  const BorA = [{n: -1, t: "前"}, {n: 1, t: "後"}];
  const dateSet = [{n: 0, d: "今日"}, {n: 1, d: "明日"}, {n: -1, d: "昨日"}, {n: 2, d: "明後日"}, {n: -2, d: "あととい"}, {n: 3, d: "しあさって"}, {n: -3, d: "さきおととい"}];
  const dateQuestion = ["何日", "何曜日"];
  const daySet = ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"];
  document.addEventListener('click', () => {
    if (isGaming) {
      return;
    }
    startTime = Date.now();
    result.classList.remove("show");
    instruction.classList.add('hide');
    quizCount = 1;
    correctCount = 0;
    isGaming = true;
    new TimeGame(11, 30);
    replay.textContent = "";
  });
  function setNewDate(day, gap) {
    return new Date(day.setDate(day.getDate() + gap));
  }
  class DateGame {
    constructor() {
      this.date = new Date();
      this.questionIndex = Math.floor(Math.random() * 2);
      this.BorAIndex = Math.floor(Math.random() * 2);
      this.gapDate;
      this.setQuestion();
      this.correctDate = setNewDate(this.date, this.gapDate);
      this.targetDate = this.correctDate.getDate();
      this.targetDay = this.correctDate.getDay();
      this.setChoices();
    }
    getResult() {
      const t = Math.floor((Date.now() - startTime) / 1000);
      replay.textContent = `タイムは${t}秒だよ。もう一度チャレンジするにはクリックしてね。`;
      setTimeout(() => {
        isGaming = false;
      }, 100);
    }
    setChoices() {
      while (choicesarea.firstChild) {
        choicesarea.removeChild(choicesarea.firstChild);
      }
      if (this.questionIndex === 1) {
        let d = this.targetDay + 3 < 7 ? this.targetDay + 3 : this.targetDay - 4;
        const n = [0, 1, 2, 3, 4, 5, 6];
        n.splice(d, 1);
        for (let i = 0; i < 6; i++) {
          const div = document.createElement('div');
          const day = n.splice(Math.floor(Math.random() * n.length), 1)[0];
          div.textContent = `${daySet[day]}日`;
          choicesarea.appendChild(div);
          div.addEventListener('click', () => {
            if (day === this.targetDay) {
              correctCount++;
              result_correct.textContent = '正解！';
            } else {
              result_correct.textContent = '残念！不正解';
            }
            result_score.textContent = `SCORE : ${correctCount} / ${quizCount}`;
            result.classList.add('show'); 
            if (correctCount === 10) {
              this.getResult();
              return;
            } 
            setTimeout(() => {
              result.classList.remove('show');
              quizCount++;
                new DateGame();
            }, 900);         
          });  
        }
      } else {
        const choiceGaps = [0, 1, -1, 2 * (Math.random() < 0.5 ? 1 : -1), 3 * (Math.random() < 0.5 ? 1 : -1), 5 * (Math.random() < 0.5 ? 1 : -1)];
        console.log(choiceGaps);
        for (let i = 0; i < 6; i++) {
          const div = document.createElement('div');
          const gap = choiceGaps.splice(Math.floor(Math.random() * choiceGaps.length), 1)[0];
          const choice = setNewDate(this.correctDate, gap);
          div.textContent = `${choice.getDate()}日`;
          choicesarea.appendChild(div);
          setNewDate(this.correctDate, - gap);
          div.addEventListener('click', () => {
            if (gap === 0) {
              correctCount++;
              result_correct.textContent = '正解！';
            } else {
              result_correct.textContent = '残念！不正解';
            }
            result_score.textContent = `SCORE : ${correctCount} / ${quizCount}`;
            result.classList.add('show'); 
            if (correctCount === 10) {
              this.getResult();
              return;
            } 
            setTimeout(() => {
              result.classList.remove('show');
              quizCount++;
                new DateGame();
            }, 900);         
          });  
        }
      }      
    }
    setQuestion() {
      let dir;
      switch(correctCount) {
        case 5:
          dir = Math.floor(Math.random() * 3);
          question1.textContent = `${dateSet[dir].d}は`;
          this.gapDate = dateSet[dir].n;
          break;
        case 6:
          dir = Math.floor(Math.random() * 4) + 3;
          question1.textContent = `${dateSet[dir].d}は`;
          this.gapDate = dateSet[dir].n;
          break;
        case 7:
          dir = Math.floor(Math.random() * 4) + 4;
          question1.textContent = `${dir}日${BorA[this.BorAIndex].t}は`;
          this.gapDate = dir * BorA[this.BorAIndex].n;
          break;
        case 8:
          dir = Math.floor(Math.random() * 12) + 8;
          question1.textContent = `${dir}日${BorA[this.BorAIndex].t}は`;
          this.gapDate = dir * BorA[this.BorAIndex].n;
          break;
        case 9:
          dir = Math.floor(Math.random() * 20) + 20;
          question1.textContent = `${dir}日${BorA[this.BorAIndex].t}は`;
          this.gapDate = dir * BorA[this.BorAIndex].n;
          break;        
      } 
      question2.textContent = `${dateQuestion[this.questionIndex]}?`;
    }
  }
  class TimeGame {
    constructor(minGap, maxGap) {      
      this.BorAIndex = Math.floor(Math.random() * 2);
      this.time = Math.floor(Math.random() * 24 * 60);
      this.gapTime = Math.floor(Math.random() * (maxGap - minGap)) + minGap;
      this.correctTime = this.getCorrectTime();
      this.setQuestion();
      this.choiceTimes = [this.correctTime, this.correctTime + 10,
        this.correctTime - 10];
      this.setChoiceTimes();
      this.setChoices();
    }
    setChoices() {
      while (choicesarea.firstChild) {
        choicesarea.removeChild(choicesarea.firstChild);
      }
      for (let i = 0; i < 6; i++) {
        const div = document.createElement('div');
        const choiceTime = this.choiceTimes.splice(Math.floor(Math.random() * this.choiceTimes.length), 1)[0];
        div.textContent = `${AorP[Math.floor(choiceTime / 720)]}${Math.floor(choiceTime / 60) % 12}:${String(choiceTime % 60).padStart(2, "0")}`;
        choicesarea.appendChild(div);
        div.addEventListener('click', () => {
          if (choiceTime === this.correctTime) {
            correctCount++;
            result_correct.textContent = '正解！';
          } else {
            result_correct.textContent = '残念！不正解';
          }
          result_score.textContent = `SCORE : ${correctCount} / ${quizCount}`;
          result.classList.add('show'); 
          setTimeout(() => {
            result.classList.remove('show');
            quizCount++;
            if (correctCount < 5) {
              new TimeGame(11 + 30 * correctCount, 45 + 30 * correctCount);
            } else {
              new DateGame();
            }
          }, 900);         
        });
      }
    }
    setChoiceTimes() {
      let otherTimes = [
        this.correctTime + 1,
        this.correctTime - 1,
        this.correctTime + (2 * (Math.random() < 0.5 ? 1 : -1)),
        this.correctTime + (3 * (Math.random() < 0.5 ? 1 : -1)),
        this.correctTime + (4 * (Math.random() < 0.5 ? 1 : -1)),
        this.correctTime + (5 * (Math.random() < 0.5 ? 1 : -1)),
        this.time + this.gapTime * (this.BorAIndex === 0 ? 1 : -1),
      ];
      otherTimes.forEach((otherTime, index) => {
        if (otherTime < 0) {
          otherTimes[index] = otherTime + (24 * 60);
        } else if (otherTime >= (24 * 60)) {
          otherTimes[index] = otherTime - (24 * 60);
        } 
      });
      for (let i = 0; i < 3; i++) {
        this.choiceTimes.push(otherTimes.splice(Math.floor(Math.random() * otherTimes.length), 1)[0]);
      }
    }
    setQuestion() {
      question1.textContent = `${AorP[Math.floor(this.time / 720)]}${Math.floor(this.time / 60) % 12}:${String(this.time % 60).padStart(2, "0")} の`;
      if (this.gapTime < 120) {
        question2.textContent = `${this.gapTime}分${BorA[this.BorAIndex].t}は何時何分?`;
      } else if (this.gapTime % 60 === 0) {
        question2.textContent = `${this.gapTime / 60}時間${BorA[this.BorAIndex].t}は何時何分?`;
      } else {
        question2.textContent = `${Math.floor(this.gapTime / 60)}時間${this.gapTime % 60}分${BorA[this.BorAIndex].t}は何時何分?`;
      }
    }
    getCorrectTime() {
      const correctTime = this.time + this.gapTime * BorA[this.BorAIndex].n;
      if (correctTime < 0) {
        return correctTime + (24 * 60);
      } else if (correctTime >= (24 * 60)) {
        return correctTime - (24 * 60);
      } else {
        return correctTime;
      }
    }
  }
      
}