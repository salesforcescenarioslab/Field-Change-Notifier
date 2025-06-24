import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class SlaChangeSubscriber extends LightningElement {
    @api recordId;
    channelName = '/event/FieldChangeNotification__e';
    subscription = {};
    previousValue;

    connectedCallback() {
        this.handleSubscribe();
        this.registerErrorListener();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    handleSubscribe() {
        const messageCallback = (response) => {
            const payload = response.data.payload;

            if (payload && payload.RecordId__c && this.recordId) {
                if (payload.RecordId__c.startsWith(this.recordId)) {
                    const currentValue = payload.New_SLA_Value__c;
                    if (currentValue !== this.previousValue) {
                        this.showToast(
                            'SLA Changed',
                            'You have changed the SLA value. Please verify this update carefully.',
                            'warning'
                        );
                        this.previousValue = currentValue;
                    }
                }
            }
        };

        subscribe(this.channelName, -1, messageCallback)
            .then(response => {
                this.subscription = response;
            })
            .catch(error => {
                console.error('Subscription error:', JSON.stringify(error));
            });
    }

    handleUnsubscribe() {
        if (this.subscription && this.subscription.id) {
            unsubscribe(this.subscription, () => {});
        }
    }

    registerErrorListener() {
        onError(error => {
            console.error('Platform Event Error:', JSON.stringify(error));
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}
