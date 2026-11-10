(() => {
"use strict";
const choices={
scientific:{title:"Your interests may connect with the Scientific track",description:"Explore scientific subjects, laboratory learning and mathematical problem-solving. Review the approved subject combinations with your school.",link:"Explore the Scientific track",target:"#scientific"},
commercial:{title:"Your interests may connect with the Commercial track",description:"Explore accounting, economics, finance and business projects. Check which subjects and programmes match your future plans.",link:"Explore the Commercial track",target:"#commercial"},
literary:{title:"Your interests may connect with the Literary track",description:"Explore languages, history, humanities and communication. Consider the reading, research and writing involved in these fields.",link:"Explore the Literary track",target:"#literary"}};
const t=key=>window.HamadI18n?.t(key)||key;
function init(){const buttons=[...document.querySelectorAll("[data-pathway-choice]")],result=document.getElementById("pathwayFinderResult");if(!buttons.length||!result)return;let selected="";
function render(key){const item=choices[key];if(!item)return;selected=key;buttons.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.pathwayChoice===key)));result.replaceChildren();
const label=document.createElement("span");label.className="spec-finder-result-label";label.textContent=t("YOUR EXPLORATION STARTS HERE");
const heading=document.createElement("h3");heading.textContent=t(item.title);
const description=document.createElement("p");description.textContent=t(item.description);
const link=document.createElement("a");link.href=item.target;link.textContent=t(item.link);
const arrow=document.createElement("span");arrow.className="ui-icon-inline";arrow.dataset.icon=document.documentElement.dir==="rtl"?"arrow-left":"arrow-up-right";arrow.setAttribute("aria-hidden","true");link.append(" ",arrow);
const note=document.createElement("p");note.className="spec-finder-result-caveat";note.textContent=t("Your selection is a conversation starter, not a recommendation or eligibility decision.");result.append(label,heading,description,link,note);}
buttons.forEach(b=>b.addEventListener("click",()=>render(b.dataset.pathwayChoice)));window.addEventListener("hamad-language-change",()=>{if(selected)render(selected);});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();