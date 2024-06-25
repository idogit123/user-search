from faker import Faker
from csv import writer as csv_writer

faker = Faker()

def fake_user():
    return [
        faker.first_name(), # first name
        faker.last_name(), # last name
        faker.city() # city name
    ]

def fake_users_to_csv(num_of_users):
    users = []
    for _  in range(num_of_users):
        users.append( fake_user() )

    with open('user-generator/fake_users.csv', 'w') as csv_file:
        writer = csv_writer(csv_file, lineterminator='\n')
        
        # write headers.
        writer.writerow(['firstName', 'lastName', 'city'])
        # write users
        writer.writerows(users)

def main():
    fake_users_to_csv(10)

main()