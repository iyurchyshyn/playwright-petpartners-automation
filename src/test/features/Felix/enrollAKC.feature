@test2
Feature: feature1

  Scenario: scenario1
    Given open the AKC Enroll web page
    And fill the Get Quote Page - AKC
      | PET NAME  | ZIP CODE | PET TYPE | PET BREED     | PET AGE | EMAIL ADDRESS         |
      | PETRANDOM |    77433 | dog      | Affenpinscher |       2 | akcRANDOM@yopmail.com |
    And click ADD TO CART button in Coverage Page - AKC
    And fill the Complete Your Enrollment Page - AKC
      | FIRST NAME | LAST NAME | ADDRESS        | APT, SUITE, ETC. | PHONE NUMBER | CARD NUMBER      | EXPIRES | CVC |
      | FnRANDOM   | LnRANDOM  | RANDOM Address | RANDOM Apt       |   1234567891 | 4242424242424242 |    1225 | 123 |
    Then verify the "Congratulations on your enrollment!" is displayed - AKC
