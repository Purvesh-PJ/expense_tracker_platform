import React, { useEffect, useState } from 'react';
import { getIncome } from '../services/IncomeService';
import { getExpenses } from '../services/ExpenseService';
import { Bar, Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

const Container = styled.div`
    display : flex;
    flex-direction : column;
    width : 100%;
`;

// Styled Components
const DashboardContainer = styled.div`
    display : flex;
    flex-direction : row-reverse;
    padding: 2rem;
    background-color: white;
    // min-height: 100vh;
    font-family: 'Roboto', sans-serif;
    // border : 1px solid gray;
    border-radius : 1rem;
`;

const ChartSection = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 1rem;
`;

const ChartWrapper = styled.div`
    width: 70%;
    min-width: 300px;
    background-color: #fff;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h1`
    text-align: center;
    color: #333;
`;

const SubTitle = styled.h3`
    text-align: center;
    color: #555;
`;

const DoughnutWrapper = styled.div`
    margin-top: 2rem;
    width: 40%;
    min-width: 300px;
    margin: 2rem auto;
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 10px;
    // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.p`
    text-align: center;
    font-size: 1.2rem;
    color: #666;
`;

const ErrorMessage = styled.p`
    text-align: center;
    color: red;
    font-size: 1.2rem;
`;

const DataVisualization = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    console.log(expenses);
    console.log(incomes);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const expensesData = await getExpenses(userId);
                const incomesData = await getIncome(userId);
                setExpenses(expensesData);
                setIncomes(incomesData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (loading) return <LoadingMessage>Loading...</LoadingMessage>;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    // Prepare Data for Charts
    const expenseChartData = {
        labels: expenses.map(expense => new Date(expense.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Expenses',
                data: expenses.map(expense => expense.amount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    const incomeChartData = {
        labels: incomes.map(income => new Date(income.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Incomes',
                data: incomes.map(income => income.amount),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const doughnutData = {
        labels: ['Total Income', 'Total Expense'],
        datasets: [
            {
                label: 'Income vs Expense',
                data: [
                    incomes.reduce((total, inc) => total + inc.amount, 0),
                    expenses.reduce((total, exp) => total + exp.amount, 0),
                ],
                backgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <Container>
            <Heading>Dashboard</Heading>
            <DashboardContainer>
            
                <ChartSection>
                    <ChartWrapper>
                        <SubTitle>Income Over Time</SubTitle>
                        <Bar data={incomeChartData} options={{ responsive: true }} />
                    </ChartWrapper>

                    <ChartWrapper>
                        <SubTitle>Expense Over Time</SubTitle>
                        <Bar data={expenseChartData} options={{ responsive: true }} />
                    </ChartWrapper>
                </ChartSection>

                <DoughnutWrapper>
                    <SubTitle>Income vs Expense Overview</SubTitle>
                    <Doughnut data={doughnutData} options={{ responsive: true }} />
                </DoughnutWrapper>
            </DashboardContainer>
        </Container>
    );
};

export default DataVisualization;
