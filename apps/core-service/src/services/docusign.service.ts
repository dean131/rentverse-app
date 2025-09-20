// File Path: apps/core-service/src/services/docusign.service.ts
import docusign from "docusign-esign";
import { config } from "../config/index.js";
import { User, Property, TenancyAgreement, Project } from "@prisma/client";

// Define a more specific type for the property object that includes its relations
type PropertyWithProject = Property & { project: Project | null };
type FullAgreementDetails = TenancyAgreement & {
  owner: User;
  tenant: User;
  property: PropertyWithProject;
};

// This service encapsulates all logic for interacting with the DocuSign API.
export class DocusignService {
  private apiClient: docusign.ApiClient;
  private accountId: string;

  constructor() {
    this.apiClient = new docusign.ApiClient();
    this.apiClient.setOAuthBasePath("account-d.docusign.com"); // Use the developer sandbox
    this.accountId = config.docusign.accountId;
  }

  private async initializeApiClient() {
    try {
      const privateKey = Buffer.from(config.docusign.privateKey, "base64");
      const consentScopes = ["signature", "impersonation"];

      const response = await this.apiClient.requestJWTUserToken(
        config.docusign.clientId,
        config.docusign.impersonatedUserId,
        consentScopes,
        privateKey,
        3600
      );

      const accessToken = response.body.access_token;
      const userInfo = await this.apiClient.getUserInfo(accessToken);
      this.apiClient.setBasePath(userInfo.accounts[0].baseUri + "/restapi");
      this.apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);

      console.log("DocuSign API client initialized successfully.");
    } catch (error: any) {
      console.error(
        "Error initializing DocuSign API client:",
        error?.response?.body || error
      );
      throw new Error("Failed to initialize DocuSign service.");
    }
  }

  private createDocument(
    agreement: TenancyAgreement,
    owner: User,
    tenant: User,
    property: PropertyWithProject
  ): string {
    // CORRECTED: The 'property' parameter is now strongly typed, so 'property.project' is accessible.
    let docHtml = `
            <!DOCTYPE html><html><body style="font-family: sans-serif; line-height: 1.6;">
                <h1 style="text-align: center;">Tenancy Agreement</h1>
                <p>This agreement is made on <strong>${new Date().toLocaleDateString("en-GB")}</strong>.</p>
                <h3>Parties Involved</h3>
                <p><strong>Landlord/Owner:</strong> ${owner.fullName} (${owner.email})</p>
                <p><strong>Tenant:</strong> ${tenant.fullName} (${tenant.email})</p>
                <h3>Property Details</h3>
                <p><strong>Property:</strong> ${property.title}</p>
                <p><strong>Address:</strong> ${property.project?.address || "N/A"}</p>
                <h3>Agreement Terms</h3>
                <p><strong>Term:</strong> From ${new Date(agreement.startDate).toLocaleDateString("en-GB")} to ${new Date(agreement.endDate).toLocaleDateString("en-GB")}.</p>
                <p><strong>Rent:</strong> MYR ${agreement.rentAmount.toLocaleString()} per ${property.paymentPeriod?.toLowerCase() || "period"}.</p>
                <br/><br/>
                <p><strong>Landlord Signature:</strong></p>
                <div id="ownerSign" style="width: 200px; height: 50px;"></div>
                <br/><br/>
                <p><strong>Tenant Signature:</strong></p>
                <div id="tenantSign" style="width: 200px; height: 50px;"></div>
            </body></html>
        `;
    return Buffer.from(docHtml).toString("base64");
  }

  async createAndSendEnvelope(agreement: FullAgreementDetails) {
    await this.initializeApiClient();

    const { owner, tenant, property } = agreement;
    const documentBase64 = this.createDocument(
      agreement,
      owner,
      tenant,
      property
    );

    // CORRECTED: Define DocuSign objects as plain JavaScript objects that match the SDK's types.
    // This avoids using non-existent constructors and satisfies TypeScript.
    const ownerSigner: docusign.Signer = {
      email: owner.email,
      name: owner.fullName,
      recipientId: "1",
      routingOrder: "1",
      tabs: {
        signHereTabs: [
          {
            anchorString: "/ownerSign/",
            anchorYOffset: "10",
            anchorUnits: "pixels",
          },
        ],
      },
    };

    const tenantSigner: docusign.Signer = {
      email: tenant.email,
      name: tenant.fullName,
      recipientId: "2",
      routingOrder: "2",
      tabs: {
        signHereTabs: [
          {
            anchorString: "/tenantSign/",
            anchorYOffset: "10",
            anchorUnits: "pixels",
          },
        ],
      },
    };

    const envelopeDefinition: docusign.EnvelopeDefinition = {
      emailSubject: `Please Sign: Tenancy Agreement for ${property.title}`,
      documents: [
        {
          documentBase64: documentBase64,
          name: "Tenancy Agreement",
          fileExtension: "html",
          documentId: "1",
        },
      ],
      recipients: {
        signers: [ownerSigner, tenantSigner],
      },
      status: "sent",
    };

    const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
    const results = await envelopesApi.createEnvelope(this.accountId, {
      envelopeDefinition,
    });

    return results.envelopeId;
  }
}
