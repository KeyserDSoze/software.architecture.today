targetScope = 'resourceGroup'

@description('Azure region for workload-owned resources.')
param location string = resourceGroup().location

@allowed([
  'dev'
  'staging'
  'prod'
])
@description('Deployment environment.')
param environmentName string

@description('Globally unique App Service name.')
param appName string

@description('App Service Plan name.')
param appServicePlanName string

@description('Globally unique Key Vault name.')
@minLength(3)
@maxLength(24)
param keyVaultName string

@description('Globally unique Service Bus namespace name.')
param serviceBusNamespaceName string

@description('Payment Escalation queue name.')
param paymentEscalationQueueName string = 'payment-escalations'

@description('Log Analytics workspace name.')
param logAnalyticsName string

@description('Application Insights component name.')
param applicationInsightsName string

@description('Existing subnet resource ID used by App Service VNet integration. Provided by the ESI application landing zone.')
param appIntegrationSubnetId string

@description('Existing subnet resource ID used for workload private endpoints. Provided by the ESI application landing zone.')
param privateEndpointSubnetId string

@description('Microsoft Entra tenant ID used by App Service authentication.')
param entraTenantId string = tenant().tenantId

@description('Client ID of the pre-created Microsoft Entra application registration for Order Operations.')
param entraClientId string

@description('Resource tags required by the workload.')
param tags object = {
  workload: 'order-operations'
  owner: 'commerce-operations'
}

var commonTags = union(tags, {
  environment: environmentName
  managedBy: 'bicep'
})

var keyVaultSecretsUserRoleDefinitionId = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  '4633458b-17de-408a-b874-0445c86b69e6'
)

var serviceBusDataSenderRoleDefinitionId = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  '69a216fc-b8fb-44d8-bc22-1f3c2cd27a39'
)

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  tags: commonTags
  properties: {
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  kind: 'web'
  tags: commonTags
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  tags: commonTags
  sku: {
    name: 'S1'
    tier: 'Standard'
    capacity: 1
  }
  properties: {
    reserved: true
    zoneRedundant: false
  }
}

resource webApp 'Microsoft.Web/sites@2024-04-01' = {
  name: appName
  location: location
  kind: 'app,linux'
  tags: commonTags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    publicNetworkAccess: 'Disabled'
    clientAffinityEnabled: false
    virtualNetworkSubnetId: appIntegrationSubnetId
    vnetRouteAllEnabled: true
    siteConfig: {
      alwaysOn: true
      ftpsState: 'Disabled'
      http20Enabled: true
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      remoteDebuggingEnabled: false
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'KEY_VAULT_URI'
          value: keyVault.properties.vaultUri
        }
        {
          name: 'SERVICE_BUS_NAMESPACE'
          value: '${serviceBusNamespace.name}.servicebus.windows.net'
        }
        {
          name: 'PAYMENT_ESCALATION_QUEUE'
          value: paymentEscalationQueue.name
        }
      ]
    }
  }
}

resource appAuth 'Microsoft.Web/sites/config@2022-09-01' = {
  name: 'authsettingsV2'
  parent: webApp
  properties: {
    platform: {
      enabled: true
    }
    globalValidation: {
      requireAuthentication: true
      unauthenticatedClientAction: 'Return401'
      redirectToProvider: 'azureactivedirectory'
    }
    httpSettings: {
      requireHttps: true
    }
    identityProviders: {
      azureActiveDirectory: {
        enabled: true
        registration: {
          clientId: entraClientId
          openIdIssuer: 'https://login.microsoftonline.com/${entraTenantId}/v2.0'
        }
        validation: {
          allowedAudiences: [
            'api://${entraClientId}'
          ]
        }
      }
    }
  }
}

resource ftpPublishingPolicy 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2025-03-01' = {
  name: 'ftp'
  parent: webApp
  properties: {
    allow: false
  }
}

resource scmPublishingPolicy 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2025-03-01' = {
  name: 'scm'
  parent: webApp
  properties: {
    allow: false
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2024-11-01' = {
  name: keyVaultName
  location: location
  tags: commonTags
  properties: {
    tenantId: entraTenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Disabled'
    networkAcls: {
      bypass: 'None'
      defaultAction: 'Deny'
    }
  }
}

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: serviceBusNamespaceName
  location: location
  tags: commonTags
  sku: {
    name: 'Premium'
    tier: 'Premium'
    capacity: 1
  }
  properties: {
    disableLocalAuth: true
    publicNetworkAccess: 'Disabled'
    zoneRedundant: false
  }
}

resource paymentEscalationQueue 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' = {
  name: paymentEscalationQueueName
  parent: serviceBusNamespace
  properties: {
    lockDuration: 'PT1M'
    maxSizeInMegabytes: 1024
    requiresDuplicateDetection: false
    requiresSession: false
    defaultMessageTimeToLive: 'P14D'
    deadLetteringOnMessageExpiration: true
    maxDeliveryCount: 10
    enablePartitioning: false
  }
}

resource keyVaultSecretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webApp.identity.principalId, keyVaultSecretsUserRoleDefinitionId)
  scope: keyVault
  properties: {
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: keyVaultSecretsUserRoleDefinitionId
  }
}

resource serviceBusSender 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(paymentEscalationQueue.id, webApp.identity.principalId, serviceBusDataSenderRoleDefinitionId)
  scope: paymentEscalationQueue
  properties: {
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: serviceBusDataSenderRoleDefinitionId
  }
}

resource webAppPrivateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${appName}-pe'
  location: location
  tags: commonTags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: '${appName}-connection'
        properties: {
          privateLinkServiceId: webApp.id
          groupIds: [
            'sites'
          ]
        }
      }
    ]
  }
}

resource keyVaultPrivateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${keyVaultName}-pe'
  location: location
  tags: commonTags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: '${keyVaultName}-connection'
        properties: {
          privateLinkServiceId: keyVault.id
          groupIds: [
            'vault'
          ]
        }
      }
    ]
  }
}

resource serviceBusPrivateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${serviceBusNamespaceName}-pe'
  location: location
  tags: commonTags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: '${serviceBusNamespaceName}-connection'
        properties: {
          privateLinkServiceId: serviceBusNamespace.id
          groupIds: [
            'namespace'
          ]
        }
      }
    ]
  }
}

output webAppName string = webApp.name
output webAppPrincipalId string = webApp.identity.principalId
output serviceBusNamespaceFqdn string = '${serviceBusNamespace.name}.servicebus.windows.net'
output keyVaultUri string = keyVault.properties.vaultUri
output applicationInsightsConnectionString string = appInsights.properties.ConnectionString
