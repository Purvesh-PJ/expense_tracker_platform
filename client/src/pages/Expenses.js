import { MainLayout } from '../components/layout';
import { Card, CardContent, Text } from '../components/base';

const Expenses = () => {
  return (
    <MainLayout title="Expenses" subtitle="Track your spending">
      <Card>
        <CardContent>
          <Text $color="secondary">Expense tracking coming in next phase...</Text>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Expenses;
