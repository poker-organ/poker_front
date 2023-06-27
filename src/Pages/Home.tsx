import { Header } from "./Header";
import * as API from "./ApiGoogle";
import { useContext, useEffect, useState } from "react";
import { QuestionsContext, QuizzContext } from "../context/QuizzContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReactStars from "react-rating-stars-component";
import { Quizz_t } from "../types/types";
import { Overlay, ScenarioOverlay } from "./Overlay";

const SubMenu = ({ col, title, content, logo }) => <div className={`SubMenu bg-subMenu ${col} px-0 d-flex flex-column`}>
    <div className="header d-flex ">
        <p className={`h1 bi ${logo} me-3 bg-teal px-2 py-1`} />
        <h2 className="d-flex justify-content-start align-self-center w-100">{title}</h2>
    </div>
    {content}
</div>


/**
 * function to create the home page
 * @returns {HTMLElement} - The home page
 */
export const Home = () => {
    const navigate = useNavigate();
    const [, setQuestions] = useContext(QuestionsContext);
    const [quizz, setQuizz] = useContext(QuizzContext);
    const [createdQuizz, setCreatedQuizz] = useState<Quizz_t[]>([]);
    const [scenarios, setScenarios] = useState([]);

    useEffect(() => {
        API.getQuizz().then(setCreatedQuizz)
    }, []);

    const listofQuizz = createdQuizz.map((x: Quizz_t) => {
        return (<div key={`quizz_${x.id}`} className="row separator text-center align-middle ">
            <div className="col-6 d-inline-flex flex-column align-items-center justify-content-center">  {x.scenarios.map(el => { return <div key={`position_${el}`}> {el} </div> })} </div>
            <div className="col-2 d-inline-flex align-items-center justify-content-center">  {x.nbrQuestion} </div>
            <div className="col-2 d-inline-flex align-items-center justify-content-center">  {x.difficulty} </div>
            <div className="col-2 h1 bi bi-play-circle-fill m-0 d-inline-flex flex-wrap align-items-center justify-content-center" onClick={() => {
                API.GetQuestions(x).then(value => { setQuestions(value); setQuizz(x); navigate("/quiz"); })
            }}> </div>
        </div>);
    });

    useEffect(() => {
        try {
            if (quizz.situations !== null && quizz.positions != null)
                API.getScenarios({ positions: quizz.positions, situations: quizz.situations }).then(setScenarios);
        }
        catch
        {
            console.log("gapi not load");
        }
    }, [quizz.situations, quizz.positions])

    return (
        <div className="Home">
            <Header title="Quizz" />
            <div className="grid white mx-2">
                <div className="row gx-0">
                    <SubMenu col="col-4" logo="bi-plus-circle" title="CREATE QUIZZ" content={
                        <div className="content">
                            <form className="d-inline-flex flex-column flex-wrap align-items-center w-100" onSubmit={(e) => { e.preventDefault(); API.saveQuizz(quizz).then(() => API.getQuizz()).then((value) => { setCreatedQuizz(value); console.log(value) }); }}>

                                <div className="row">
                                    <label htmlFor="difficulty" className="justify-content w-50 ">
                                        Difficulty :
                                        <ReactStars
                                            value={0}
                                            starRatedColor="yellow"
                                            onChange={(value: number) => { let temp = { ...quizz }; temp.difficulty = value * 2; setQuizz(temp); }}
                                            numberOfStars={5}
                                            size={30}
                                            isHalf={true}
                                        />
                                    </label>

                                    <label htmlFor="nbr_question" className="w-50">
                                        <div>Number of question :</div>
                                        <input className="w-75" required type="number" min={0} max={50} placeholder={"how many questions ?"}
                                            onChange={(e) => { let temp = { ...quizz }; temp.nbrQuestion = e.target.value; setQuizz(temp); }} />
                                    </label>
                                </div>


                                <Overlay title={"situations"} labels={["OP", "3-Bet", "4-Bet", "5-Bet"]} set={(checks, temp) => {
                                    temp.situations = []; Object.keys(checks).filter(key => checks[key]).forEach((key) => { temp.situations.push(key) })
                                }} />
                                <Overlay title={"positions"} labels={["UTG", "HJ", "CO", "BTN", "SB", "BB"]} set={(checks, temp) => {
                                    temp.positions = []; Object.keys(checks).filter(key => checks[key]).forEach((key) => { temp.positions.push(key) })
                                }} />
                                <ScenarioOverlay title={"scenarios"} scenarios={scenarios} />

                                <input type="submit" className="btn btn-primary my-2" value="CREATE QUIZZ" />
                            </form >
                        </div>
                    } />

                    <SubMenu col="col-8 ms-2" logo="bi-play-circle-fill" title="CREATED QUIZZ" content={
                        <div className="content black bg-white m-2">
                            <div className="row separator" style={{ overflowX: "hidden", overflowY: "auto", scrollbarGutter: "stable" }}>
                                <div className="col-6"> Scenarios </div>
                                <div className="col-2"> Number </div>
                                <div className="col-2"> Difficulty </div>
                                <div className="col-2"> Play it </div>
                            </div>
                            <div className="mx-0" style={{ height: "50vh", overflowY: "auto", overflowX: "hidden", scrollbarGutter: "stable" }}>
                                {listofQuizz}
                            </div>
                        </div>}
                    />
                </div>
                <div className="row mt-2 gx-0">
                    <SubMenu col="col-4" logo="bi-plus-circle" title="STATISTIC" content={<></>} />
                    <SubMenu col="col-8 ms-2" logo="bi-plus-circle" title="HISTORIC" content={<></>} />
                </div>
            </div>
        </div >
    );
} 