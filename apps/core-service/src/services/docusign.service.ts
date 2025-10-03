// File Path: apps/core-service/src/services/docusign.service.ts
import docusign from "docusign-esign";
import { promises as fs } from "fs";
import { config } from "../config/index.js";
import { User, Property, TenancyAgreement, Project } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";

// Define a more specific type for the property object that includes its relations
type PropertyWithProject = Property & { project: Project | null };
type FullAgreementDetails = TenancyAgreement & {
  owner: User;
  tenant: User;
  property: PropertyWithProject;
};

// This service encapsulates all logic for interacting with the DocuSign API.
export class DocusignService {
  constructor() {
    this.apiClient = new docusign.ApiClient();
    this.apiClient.setOAuthBasePath("account-d.docusign.com"); // Use the developer sandbox
    this.accountId = config.docusign.accountId;
  }

  private async initializeApiClient() {
    try {
      const privateKey = Buffer.from(
        config.docusign.privateKey,
        "base64"
      ).toString("utf8");
      const consentScopes = ["signature", "impersonation"];

      const response = await this.apiClient.requestJWTUserToken(
        config.docusign.clientId,
        config.docusign.impersonatedUserId,
        consentScopes,
        Buffer.from(privateKey),
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

  // File Path: apps/core-service/src/services/docusign.service.ts

  private createDocument(
    agreement: TenancyAgreement,
    owner: User,
    tenant: User,
    property: PropertyWithProject
  ): string {
    // A more professional and styled HTML template for the agreement
    const docHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #333;
              line-height: 1.6;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #eee;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header img {
              max-width: 150px;
              margin-bottom: 10px;
            }
            h1 {
              font-size: 24px;
              color: #111;
              margin: 0;
            }
            h3 {
              font-size: 18px;
              color: #222;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
              margin-top: 30px;
            }
            p {
              font-size: 14px;
              margin: 0 0 10px;
            }
            strong {
              color: #000;
            }
            .section {
              margin-bottom: 20px;
            }
            .signature-box {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://placehold.co/150x50/F99933/FFFFFF/png?text=Rentverse" alt="Company Logo" />
              <h1>Tenancy Agreement</h1>
            </div>

            <div class="section">
              <p>This Tenancy Agreement is made on <strong>${new Date().toLocaleDateString(
                "en-GB"
              )}</strong>.</p>
            </div>

            <div class="section">
              <h3>Parties Involved</h3>
              <p><strong>Landlord / Owner:</strong> ${owner.fullName} (${
                owner.email
              })</p>
              <p><strong>Tenant:</strong> ${tenant.fullName} (${
                tenant.email
              })</p>
            </div>

            <div class="section">
              <h3>Property Details</h3>
              <p><strong>Property:</strong> ${property.title}</p>
              <p><strong>Address:</strong> ${
                property.project?.address || "N/A"
              }</p>
            </div>

            <div class="section">
              <h3>Agreement Terms</h3>
              <p><strong>Term:</strong> From <strong>${new Date(
                agreement.startDate
              ).toLocaleDateString("en-GB")}</strong> to <strong>${new Date(
                agreement.endDate
              ).toLocaleDateString("en-GB")}</strong>.</p>
              <p><strong>Rent Amount:</strong> MYR ${agreement.rentAmount.toLocaleString()} per ${
                property.paymentPeriod?.toLowerCase() || "period"
              }.</p>
            </div>

            <div class="signature-box">
              <p><strong>Landlord Signature:</strong></p>
              <div id="ownerSign" style="width: 200px; height: 50px;"></div>
            </div>

            <div class="signature-box">
              <p><strong>Tenant Signature:</strong></p>
              <div id="tenantSign" style="width: 200px; height: 50px;"></div>
            </div>
            
            <div class="footer">
              <p>Thank you for using Rentverse.</p>
            </div>
          </div>
        </body>
      </html>
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

    const ownerSigner: docusign.Signer = {
      email: owner.email,
      name: owner.fullName,
      recipientId: "1",
      routingOrder: "1",
      clientUserId: owner.id.toString(),
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
      clientUserId: tenant.id.toString(),
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
      recipients: { signers: [ownerSigner, tenantSigner] },
      status: "sent",
    };

    const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
    const results = await envelopesApi.createEnvelope(this.accountId, {
      envelopeDefinition,
    });

    return results.envelopeId;
  }

  async getRecipientViewUrl(
    envelopeId: string,
    signer: User,
    recipientId: "1" | "2",
    returnUrl: string
  ): Promise<string | undefined> {
    await this.initializeApiClient();

    const viewRequest: docusign.RecipientViewRequest = {
      authenticationMethod: "none",
      clientUserId: signer.id.toString(),
      recipientId: recipientId,
      returnUrl: returnUrl,
      userName: signer.fullName,
      email: signer.email,
    };

    const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
    const results = await envelopesApi.createRecipientView(
      this.accountId,
      envelopeId,
      { recipientViewRequest: viewRequest }
    );

    return results.url;
  }

  async downloadDocument(envelopeId: string): Promise<Buffer> {
    await this.initializeApiClient();

    const envelopesApi = new docusign.EnvelopesApi(this.apiClient);

    try {
      // The getDocument method returns the PDF content directly as a Buffer,
      // but its TypeScript definition is incorrect, so we must cast it.
      const pdfResult = await envelopesApi.getDocument(
        this.accountId,
        envelopeId,
        "combined",
        {}
      );

      // Cast to 'unknown' first, then to 'Buffer' to satisfy TypeScript.
      return pdfResult as unknown as Buffer;
    } catch (error: any) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        console.warn(
          `DocuSign API client error (4xx): Could not download document for envelope ID ${envelopeId}. This is expected for seeded demo data.`
        );
        throw new ApiError(
          404,
          "The signed document could not be found on DocuSign. This may be because it is demo data."
        );
      }
      console.error(
        "An unexpected error occurred while downloading the DocuSign document:",
        error
      );
      throw new Error("Failed to download document from DocuSign.");
    }
  }
}
