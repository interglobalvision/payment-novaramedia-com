import stripe
import datetime
import csv
from os import environ, path


class DeleteUsers:

    def __init__(self, test_live):
        if test_live == 'live':
            if input('You are working with live Stripe data. Are you sure you want to continue? y / n \n') == 'y':
                print('proceed')
            else:
                raise Exception('ABORTING LIVE RUN')
        self._apikey = environ['STRIPE_TEST_KEY'] if test_live == 'test' else environ['STRIPE_LIVE_KEY'] if test_live == 'live' else None

    def get_data(self, output_type):
        data = stripe.Customer.list(api_key=self._apikey, limit=100)
        self.input_processing(output_type, data)

        while data.has_more:
            data = stripe.Customer.list(api_key=self._apikey, starting_after=data.data[-1], limit=100)

            self.input_processing(output_type, data)

    def input_processing(self, output_type, input_data):
            for page in input_data['data']:
                try:
                    # print(page)
                    data_record = {
                        'id': page['id'],
                        'subscription_id': page['subscriptions']['data'][0]['id'],
                        'created_at': datetime.datetime.utcfromtimestamp(page['created']),
                        'email': page['email'],
                        'card_expiry': datetime.date(int(page['sources']['data'][0]['exp_year']), int(page['sources']['data'][0]['exp_month']), 1),
                        'active': page['subscriptions']['data'][0]['plan']['active'],
                        'cancelled_at': page['subscriptions']['data'][0]['canceled_at'] or page['subscriptions']['data'][0]['ended_at'] if page['subscriptions']['data'] != [] else None
                    }
                    # print(data_record)
                except IndexError: # throws IndexError when page['subscriptions]['data'] is empty
                    self.output_processing(output_type=output_type, data=page)

    def output_processing(self, output_type, data):
        data_record = {
            'created_at': str(datetime.datetime.utcfromtimestamp(data['created'])),
            'email': data['email'],
            'stripe_id': data['id']
        }
        # print(data_record)
        # WILL EITHER OUTPUT TO CSV OR PROCESS IN STRIPE DATABASE
        if str(output_type).lower() == 'csv':
            if path.isfile('novara_unsubscribers.csv') == False:
                subs_file = open('novara_unsubscribers.csv', 'w+')
                subs_file.close()
                with open('novara_unsubscribers.csv', mode='w') as csv_file:
                    writer = csv.DictWriter(csv_file, fieldnames=['created_at', 'email', 'stripe_id'])
                    writer.writeheader()

            with open('novara_unsubscribers.csv', mode='a') as csv_file:
                writer = csv.DictWriter(csv_file, fieldnames=['created_at', 'email', 'stripe_id'])

                writer.writerow(data_record)


        elif str(output_type).lower() == 'delete':
            if input('YOU ARE ABOUT TO DELETE FROM NOVARA\'S STRIPE DATABASE! Do you want to continue? y / n \n') == 'y':
                print('proceed')

                cu = stripe.Customer.retrieve(api_key=self._apikey, id=data_record['stripe_id'])
                cu.delete()

            else:
                raise Exception('ABORTING LIVE RUN')
        else:
            print('options \'csv\' or \'delete\'')


if __name__ == '__main__':
    Stripe = DeleteUsers('live')
    Stripe.get_data('csv')
