import styled from 'styled-components';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select, Badge, Spinner, H2, Text } from './components/base';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const BadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

// Demo App to showcase base components
const App = () => {
  return (
    <Container>
      <H2>Component Library Preview</H2>
      <Text $color="secondary">Base components ready for Expense Tracker</Text>

      <Section>
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <ButtonGroup>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </Section>

      <Section>
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Input label="Amount" type="number" placeholder="Enter amount" />
              <Input label="Description" placeholder="Enter description" helperText="Optional field" />
              <Input label="With Error" error="This field is required" />
              <Select
                label="Category"
                placeholder="Select category"
                options={[
                  { value: 'food', label: 'Food' },
                  { value: 'utilities', label: 'Utilities' },
                  { value: 'entertainment', label: 'Entertainment' },
                ]}
              />
            </FormGroup>
          </CardContent>
        </Card>
      </Section>

      <Section>
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeGroup>
              <Badge variant="success">Income</Badge>
              <Badge variant="danger">Expense</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Default</Badge>
            </BadgeGroup>
          </CardContent>
        </Card>
      </Section>

      <Section>
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent>
            <ButtonGroup>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </ButtonGroup>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
};

export default App;
