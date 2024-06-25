from faker import Faker

faker = Faker()

def fake_user():
    return {
        'firstName': faker.first_name(),
        'lastName': faker.last_name(),
        'city': faker.city()
    }

print(
    fake_user()
)