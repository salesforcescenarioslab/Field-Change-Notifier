# 🚀 Show Toast on SLA Field Change using Platform Event

## 📄 Description

This example shows how to display a toast notification on the Account Record Page when the `SLA__c` field is updated — using a Platform Event and Lightning Web Component subscriber.

## ✅ Components

| Component | Purpose |
| --------- | ------- |
| `FieldChangeNotification__e` | Platform Event with fields: `RecordId__c`, `New_SLA_Value__c` |
| `AccountSLAChangeTrigger` | Apex Trigger that publishes the event when `SLA__c` changes |
| `slaChangeSubscriber` | LWC that listens for the Platform Event and shows a toast |

## 🔑 Steps to Use

1. Create the Platform Event: `FieldChangeNotification__e`  
   - Fields: `RecordId__c` (Text), `New_SLA_Value__c` (Text)
2. Deploy the Apex Trigger.
3. Deploy the LWC.
4. Add the LWC to the Account Record Page in Lightning App Builder.
5. Open the Account page in one tab. In another tab, edit the same Account’s `SLA__c` → Save → See toast instantly!

## 🎉 Clean, Real-Time, Reusable!

## 💡 Author
**Deepak Ganesan | Salesforce Scenarios Lab**
