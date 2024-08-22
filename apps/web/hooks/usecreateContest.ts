import { IContest, IProblems } from "@repo/common/types"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export function useCreateContest() {
    const [newContest, setNewContest] = useState<IContest>()
    const [numberOfProblem, setNumberOfProblems] = useState<number>(0)
    const [problems, setProblems] = useState<IProblems[]>([]);
    const [loading, setLoading] = useState(true);
    const [createContest, setCreateContest] = useState<IContest>()

    useEffect(() => {
        try {
            const fetchData = async () => {
                setLoading(true);

                const problems: IProblems[] = await (await axios.get(`api/problems`)).data
                setProblems(problems);

                setLoading(false);
            };

            fetchData();
        } catch (error) {
            console.error(error);
            // Handle error here

        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        console.log({ name, value, type });
        if ((name === 'startTime' || name === 'endTime') && value !== '') {
            const formattedValue = new Date(value).toISOString();
            setCreateContest((prevState: IContest | undefined) => ({
                ...prevState,
                [name]: formattedValue
            } as IContest));
        } else {
            setCreateContest((prevState: IContest | undefined) => ({
                ...prevState,
                [name]: value
            } as IContest));
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //at save  , save the edited contest in db
        try {
            setLoading(true)
            //only passs , id , title , description , startTime , endTime , hidden
            const parsedContest = createContest ? {
                title: createContest.title,
                description: createContest.description,
                startTime: createContest.startTime,
                endTime: createContest.endTime,
            } : null;

            const response = await fetch('api/contest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedContest),
            })

            const data = await response.json();

            console.log(data);

            if (data.status !== 200) {
                return (
                    toast.error("Error in Creating contest")
                )
            }

            //update that specific contest in the contests array
            setNewContest(data?.data)
            setLoading(false)

            return (
                toast.success("Contest Created successfully")
            )
        } catch (error) {
            console.error(error);
            return toast.error('something went wrong')
        }
    }

    return {
        newContest,
        numberOfProblem,
        handleInputChange,
        handleSubmit,
        setNumberOfProblems
    }
}