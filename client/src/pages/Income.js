import { MainLayout } from '../components/layout';
import { Card, CardContent, Text } from '../components/base';

const Income = () => {
  return (
    <MainLayout title="Income" subtitle="Manage your income sources">
      <Card>
        <CardContent>
          <Text $color="secondary">Income management coming in next phase...</Text>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Income;
