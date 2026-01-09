import { MainLayout } from '../components/layout';
import { Card, CardContent, Text } from '../components/base';

const Dashboard = () => {
  return (
    <MainLayout title="Dashboard" subtitle="Overview of your finances">
      <Card>
        <CardContent>
          <Text $color="secondary">Dashboard content coming in next phase...</Text>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Dashboard;
