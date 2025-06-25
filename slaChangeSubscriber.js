import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class SlaChangeSubscriber extends LightningElement {
    @api recordId; // Parent record ID passed to the component
    channelName = '/event/FieldChangeNotification__e'; // Platform Event channel to subscribe to
    subscription = {}; // Holds the subscription object for EMP API
    previousValue; // Tracks the last known SLA value for comparison

    // Subscribe to Platform Events when component loads
    connectedCallback() {
        this.handleSubscribe();
        this.registerErrorListener();
    }

    // Unsubscribe when component is destroyed to avoid memory leaks
    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    // Handles Platform Event subscription and SLA change detection
    handleSubscribe() {
        const messageCallback = (response) => {
            const payload = response.data.payload;

            // Check if the event payload matches the current record ID
            if (payload && payload.RecordId__c && this.recordId) {
                if (payload.RecordId__c.startsWith(this.recordId)) {
                    const currentValue = payload.New_SLA_Value__c;
                    // Show toast only if SLA value changed
                    if (currentValue !== this.previousValue) {
                        this.showToast(
                            'SLA Changed',
                            'You have changed the SLA value. Please verify this update carefully.',
                            'warning'
                        );
                        this.previousValue = currentValue; // Update tracked value
                    }
                }
            }
        };

        // Subscribe to the Platform Event channel
        subscribe(this.channelName, -1, messageCallback)
            .then(response => {
                this.subscription = response; // Store subscription response
            })
            .catch(error => {
                console.error('Subscription error:', JSON.stringify(error));
            });
    }

    // Unsubscribes from the Platform Event channel
    handleUnsubscribe() {
        if (this.subscription && this.subscription.id) {
            unsubscribe(this.subscription, () => {});
        }
    }

    // Listens for EMP API errors (e.g., connection issues)
    registerErrorListener() {
        onError(error => {
            console.error('Platform Event Error:', JSON.stringify(error));
        });
    }

    // Helper method to show toast notifications
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}
